<template>
<div >
  <m-header bigTitle="可视化轻量级服务设计平台" smallTitle="LSCE"></m-header>
  <Tool @droped='showWidget'></Tool>
  <div class="showpanel" >
    <div class="jtk-demo-canvas canvas-wide drag-drop-demo jtk-surface jtk-surface-nopan" id="canvas" @keyup='getInputText' @mousedown='deleteNode'>
    </div>
  </div>
  <!-- 一个模板，显示json信息 -->
  <ShowJson :json='json'></ShowJson>
</div>
</template>

<script>
import {jsPlumb} from 'jsplumb'
import {mapGetters} from 'vuex'
import {addFunctionalNode, addFilterNode, addMergeNode} from 'common/js/lsce_jsplumb'
import {FuncNode, FilterNode, Edge} from 'common/js/json'
import MHeader from 'components/m-header'
import Tool from 'components/tool'
import ShowJson from 'components/ShowJson'
const FUNCTIONAL = 'functional'
const FILTER = 'filter'
const MERGE = 'merge'

export default {
  data() {
    return {
      instance: '',
      combinedToollist: [], // 将所有可以拖出来的节点抽出来整合出一个数组
      connections: [], // 记录连线
      sn: [], // 记录/产生serviceId
      json: {'nodes': [], 'edges': []},
      serviceUniqueClass: { // 用来给组件添加背景图片
        'Pizzahub': 'pizzahub',
        'Camera': 'camera',
        'Ais': 'ais',
        'Fencing': 'fencing',
        'Bio-sensor': 'biosensor'
      } 
    }
  },
  computed: {
    ...mapGetters([
      'toolList'
    ])
  },
  watch: {
    toolList: function() {
      this._normalizeToollist()
    }
  },
  components: {
    MHeader,
    Tool,
    ShowJson
  },
  mounted() {
    this.getJsplumbInstance()
    // document.oncontextmenu = function() {
    //   return false
    // }
  },
  methods: {
    getJsplumbInstance() {
      console.log(jsPlumb)
      var _this = this
      jsPlumb.ready(function() {
        _this.instance = jsPlumb.getInstance({
          DragOptions: { cursor: 'pointer', zIndex: 200 },
          PaintStyle: { stroke: '#666' },
          EndpointHoverStyle: { fill: 'orange' },
          HoverPaintStyle: { stroke: 'orange' },
          EndpointStyle: { width: 20, height: 16, stroke: '#666' },
          Endpoint: 'Rectangle',
          Anchors: ['TopCenter', 'TopCenter'],
          Container: 'canvas'
        })
        _this.instance.batch(function () {
          _this.instance.bind('beforeDrop', function (params) {
            if (_this.ioError(params)) {
              return confirm('Connect ' + params.sourceId + 'to' + params.targetId + '?')
            }
          })
          _this.instance.bind('connection', function (info, originalEvent) {
            _this.updateConnections(info)
            _this.updateJsonEdges('add', info)
          })
          _this.instance.bind('click', function (conn) {
            _this.instance.deleteConnection(conn)
          })
          _this.instance.bind('beforeDetach', function (conn) {
            return confirm('Delete connection?');
          });
          _this.instance.bind('connectionDetached', function (info, originalEvent) {
            _this.updateConnections(info, true);
            _this.updateJsonEdges('delete', info)
          })
          _this.instance.bind('connectionMoved', function (info, originalEvent) {
            _this.updateConnections(info, true);
          })
        })
      })
    },
    showWidget(item) {
      var e = event || window.event
      if (e.clientX >= 330 && e.clientX < window.innerWidth - 300) {
        let widgetId = ''
        if (!this.sn[item.servName]) { 
          this.sn[item.servName] = 0
        } 
        widgetId = item.servName + this.sn[item.servName]++
        let SERVNAME = item.servName
        let uniqueClass = this.serviceUniqueClass[SERVNAME]
        if (item.type === FUNCTIONAL) {
          addFunctionalNode(item, e, widgetId, this.instance, uniqueClass)
          this.updateJsonNodes('add', widgetId)
        } else if (item.type === FILTER) {
          addFilterNode(item, e, widgetId, this.instance)
          this.updateJsonNodes('add', widgetId)
        } else if (item.type === MERGE) {
          addMergeNode(item, e, widgetId, this.instance)
          this.updateJsonNodes('add', widgetId)
        }
      } else {
        console.log('you are out of the boundary')
      }
    },
    getInputText(e) { // 获取所有input的实时值并保存在filterInputValue中
      let filterInputId = e.target.id
      let obj = document.getElementById(filterInputId) // 在dom中的结构体

      let divId = e.target.parentNode.id // 用于查找json.nodes中的对应结构体
      let jsonNodesTarget = this.getTarget(this.json.nodes, 'div_id', divId)
      let index = this.json.nodes.indexOf(jsonNodesTarget) 
      this.$set(this.json.nodes[index], 'obj_info', obj.value)
    },
    getTarget(el, prop, value) {
      let target = ''
      el.forEach(function(item) {
        if (item[prop] === value) {
          target = item
        }
      })
      return target
    },
    updateConnections(conn, remove) {
      if (!remove) {
        this.connections.push(conn) // connections记录已经连过的线
      } else {
        let target = this.getTarget(this.connections, 'connection', conn.connection)
        let index = this.connections.indexOf(target)
        this.connections.splice(index, 1)
      }
      if (this.connections.length > 0) { 
        console.log(this.connections)
      } else {
        console.log('no connection')
      }
    },
    _normalizeToollist() { // 方便转成json
      this.combinedToollist = this.toolList[0].listContent.concat(this.toolList[1].listContent)
      console.log(this.combinedToollist)
    },
    deleteNode(e) {
      let _this = this
      if (e.button === 2) {
        e.preventDefault()
        let targetId = ''
        let classArr = []
        if (e.target.className === 'filterFrame') { // 判断选中的是filter
          targetId = e.target.parentNode.id
        } else {
          classArr = e.target.className.split(' ')
          if (classArr.indexOf('window') !== -1) { // 判断选中的是window
            targetId = e.target.id
          }
        }
        if (targetId) {
          let obj = document.getElementById(targetId)
          let conf = confirm('Delete widget?')
          if (conf === true) {
            _this.instance.deleteConnectionsForElement(obj)
            _this.instance.removeAllEndpoints(obj)
            obj.remove()
            _this.updateJsonNodes('delete', targetId)
          }
        }
      }
    },
    updateJsonNodes(type, value) { // type代表nodes/edges, value代表widgetId
      if (type === 'add') {
        let temp = value.replace(/[0-9]/g, '') // 这里末尾多了一个数字，要在服务库中找到该服务名temp对应的具体的服务tartget的信息
        let target = this.getTarget(this.combinedToollist, 'servName', temp)
        // 根据不同类型node来new不同的结构体
        if (target.type === FUNCTIONAL) {
          this.json.nodes.push(new FuncNode({
            divId: value,
            servName: target.servName,
            id: target.id,
            type: target.type
          }))
        } else if (target.type === FILTER || target.type === MERGE) {
          this.json.nodes.push(new FilterNode({
            divId: value,
            servName: target.servName,
            id: target.id,
            type: target.type,
            objInfo: ''
          }))
        }
      } else if (type === 'delete') {
        let target = this.getTarget(this.json.nodes, 'div_id', value)
        let index = this.json.nodes.indexOf(target)
        this.json.nodes.splice(index, 1)
      }
    },
    updateJsonEdges(type, conn) {
      // 这里的conn.sourceId和targetId后面也多了数字
      if (type === 'add') {
        let src = this.getTarget(this.combinedToollist, 'servName', conn.sourceId.replace(/[0-9]/g, ''))
        let dst = this.getTarget(this.combinedToollist, 'servName', conn.targetId.replace(/[0-9]/g, ''))
        // 这里计算的是一个node里在所有port的index
        let srcPortIndex = conn.sourceEndpoint.id.match(/_(\S*)_/)[1]  
        let dstPortIndex = conn.targetEndpoint.id.match(/_(\S*)_/)[1]
        // 这里计算两个node的inputPort的长度
        let srcinPortLength = src.input.length
        let dstinPortLength = dst.input.length
        // 连的方向反了
        if (srcPortIndex < srcinPortLength && dstPortIndex >= dstinPortLength) {
          this.json.edges.push(new Edge({
            connId: conn.connection.id,
            SRCdivId: conn.targetId, 
            SRCport: dst.output[dstPortIndex - dstinPortLength].oname,
            DSTdivId: conn.sourceId, 
            DSTport: src.input[srcPortIndex].iname
          }))
        } else { // 正常情况
          this.json.edges.push(new Edge({
            connId: conn.connection.id,
            SRCdivId: conn.sourceId, 
            SRCport: src.output[srcPortIndex - srcinPortLength].oname,
            DSTdivId: conn.targetId, 
            DSTport: dst.input[dstPortIndex].iname
          }))
        }  
      } else if (type === 'delete') {
        let target = this.getTarget(this.json.edges, 'conn_id', conn.connection.id)
        let index = this.json.edges.indexOf(target)
        this.json.edges.splice(index, 1)
      }
    },
    ioError(conn) {
      // console.log(conn)
      if (conn.sourceId === conn.targetId) {
        console.log('Error! Can not connect with self')
        return false
      } else {
        let src = this.getTarget(this.combinedToollist, 'servName', conn.sourceId.replace(/[0-9]/g, ''))
        let dst = this.getTarget(this.combinedToollist, 'servName', conn.targetId.replace(/[0-9]/g, ''))
        let srcPortIndex = conn.connection.endpoints[0].id.match(/_(\S*)_/)[1]
        let dstPortIndex = conn.dropEndpoint.id.match(/_(\S*)_/)[1] // 奇葩
        let srcinPortLength = src.input.length
        let dstinPortLength = dst.input.length

        if ((srcPortIndex < srcinPortLength && dstPortIndex < dstinPortLength) || (srcPortIndex >= srcinPortLength && dstPortIndex >= dstinPortLength)) { // 说明两种一样方向的连在一起
          console.log('Error! The type of the two ports are the same.')
          return false
        }
      }
      return true
    }
  }
}
</script>

<style>
  body, html {
    margin: 0;
    padding: 0;
  }
  .m-header{
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    padding-left: 10px;
    height: 40px;
    background-color: #0e90d2;
    border-color: #0b6fa2;
    color: #fff;
  }
  .topbar{
    float:left;
    margin: 0;
    line-height: 40px;
    font-size:18px;
  }
  .showpanel{
    position: absolute;
    top: 40px;
    bottom: 0;
    left: 330px;
    right: 300px;
    border: 1px solid #ccc;
  }
  #canvas{
    height: 100%;
  }
  .portname{
    font-size: 12px;
    padding: 0 3px 0 3px;
  }
  .filter {
    width: 170px;
    height: 170px;
    z-index: 25;
  }
  .filterFrame{
    position: absolute;
    font-family: serif;
    background-color: white;
    border: 1px solid #346789;
    z-index: -1;
    cursor: pointer;
    -o-box-shadow: 2px 2px 19px #aaa;
    -webkit-box-shadow: 2px 2px 19px #aaa;
    -moz-box-shadow: 2px 2px 19px #aaa;
    box-shadow: 2px 2px 19px #aaa;
    -moz-border-radius: 0.5em;
    border-radius: 0.5em;
    color: black;
    top: 25px;
    left: 25px;
    width: 120px;
    height: 120px;
    line-height: 24px;
    -webkit-transition: -webkit-box-shadow 0.15s ease-in;
    -moz-transition: -moz-box-shadow 0.15s ease-in;
    -o-transition: -o-box-shadow 0.15s ease-in;
    transition: box-shadow 0.15s ease-in;
    -moz-transform:rotate(45deg);
    -webkit-transform:rotate(45deg);
    -o-transform:rotate(45deg);
    transform:rotate(45deg);
  }
  .filterInput{
    width: 100px;
    display: block;
    margin: 26px 38px;
  }
  .mergeInput{
    width: 80px;
    display: block;
    margin: 20px 38px;
  }

  /*为组件添加特有的css*/
  .pizzahub{
    background-image: url('../../static/image/browser.png');
    background-repeat: no-repeat;
    background-size: cover;
     /*138px 115px; */
  }
  .camera{
    background: url('../../static/image/camera-background.png') no-repeat center center;
    background-size: 70px 70px;
  }
  .ais{
    background: url('../../static/image/location.png') no-repeat center center;
    background-size: 70px 70px;
  }
  .fencing{
    background: url('../../static/image/fencing.png') no-repeat center center;
    background-size: 50px 50px;
  }
  .biosensor{
    background: url('../../static/image/bio-sensor.png') no-repeat center center;
    background-size: 70px 70px;
  }
</style>