<template>
<div>
	<m-header bigTitle="可视化轻量级服务聚合器" smallTitle="PizzaHub"></m-header>
  <sider @droped='showWidget'></sider>
  <div class="content-body" >
    <!-- <button type="" @click="sendtochild(hhh)">change</button> -->
    <ul ref="showpanel">
      <li class="widget" v-for="(item,index) in widgets" v-show="!item.deleted">
       <span class="iconfont icon-delete" @click="deleted(item)"></span>
        <div>
          <!-- entityObjArr:此服务包含的实体对象数组 -->
          <!-- sources：this.sources -->
          <component 
          v-bind:is="item.template"  
          :entityObjArr='item.sources'  
          :sources='testSources'
          :index='index'
          :screenWidth = 'screenWidth'
          @binded="childbinded"
          @childcontrol="Ctr">
          </component>
        </div>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import dragula from 'dragula'
import MHeader from 'components/m-header'
import Sider from 'components/sider'
import Pic from 'components/widgets/pic'
import Words from 'components/widgets/words'
import Chart from 'components/widgets/chart'
import Video from 'components/widgets/video'
import Ais from 'components/widgets/ais'
import * as io from 'socket.io-client'
import {mapMutations, mapGetters} from 'vuex'

export default {
  data() {
    return {
      widgets: [],
      // sources: [],   // 从sources.json读的deviceName初始值 //改为vuex中获取
      variableSources: {},  // 从vuex中的sources复制到本地，避免接收数据时频繁mutation
      testSources: {},
      scflag: false, // this.socket.on('connect'时赋为true
      url: '',       // sources.json中socketurl字段
      socket: null,
      // dataSource: 在本地记录注册(绑定)过的数据源
      // dataSource: [],  // 索引为字符串的array也可工作，但vue-devtool无法显示dataSource
      dataSource: {},     // 改为object，每个key的value为数组。
      screenWidth: document.body.clientWidth
    }
  },
  components: {
    MHeader,
    Sider,
    Pic,
    Words,
    Chart,
    Video,
    Ais
  },  
  computed: {
    ...mapGetters({
      remoteSources: 'sources'  // vuex只作初始sources传递作用
    })
  },
  methods: {
    // 读sources.json,赋值sources与url、创建socket
    getSources() {
      // 从entities的initialData初始化this.sources
      // this.entities.forEach((function(entity, index) {)
      // 获取socket地址赋值给this.url
      var _this = this
      this.$http.get('../../static/sources.json').then(function(res) {
        console.log(res)
        // 改为从entities的initialData初始化this.sources
        // _this.sources = res.body
        // _this.url = _this.sources.socketurl
        _this.url = res.body.socketurl
        // console.log(_this.url)
      }).then(function(res) {
        // import * as io from 'socket.io-client'
        // _this.url赋值后才能传入 createIo
        _this.createIo(_this.url, io, true)  
      })
      // 把vuex中的sources复制到本地的variableSources
      // this.variableSources = this.remoteSources // 这么写没用object是引用类型
      // this.variableSources = this.cloneObj(this.remoteSources);

    /*   test */
      this.$http.get('../../static/sourcesNew.json').then(function(res) {
        console.log(res)
        _this.testSources = res.body
      })
      /*   test */
    },
    // 深复制对象方法 https://blog.csdn.net/liyujia6636/article/details/52198128   
    cloneObj: function(obj) {  
      var newObj = {};  
      if (obj instanceof Array) {  
        newObj = [];  
      }  
      for (var key in obj) {  
        var val = obj[key];  
        // newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; //arguments.callee 在哪一个函数中运行，它就代表哪个函数, 一般用在匿名函数中。  
        newObj[key] = typeof val === 'object' ? this.cloneObj(val) : val;  
      }  
      return newObj;  
    },
    showWidget: function(i) {
      console.log(this.screenWidth)
      var widget = {}
      widget.imgsrc = i.iconImg
      widget.text = i.servName
      widget.template = i.template
      widget.sources = i.sources
      widget.deleted = false
      this.widgets.push(widget)
    },
    ...mapMutations({
      socketConnect: 'SOCKET_CONNECT'
    }),
    createIo (url, io, value) {
      this.socket = io.connect(this.url)

      this.socket.on('connect', function() {
        console.log('connection successed (client)')
        this.scflag = value
        
        if (this.scflag) {
          // 设置vuex socketConnectedFlag为true
          this.socketConnect(true)
          console.log(`state标志位： ${this.$store.state.socketConnectedFlag}`)
        } else {
          console.log('内部监听失败')
        }
      }.bind(this))  // ?
      var _this = this  // 为什么onconnect不需要？
      this.socket.on('datacome', function(data) {
        // console.log(data)
        // console.log(`data.name: ${data.name}`)
        // console.log(`data.data: ${data.data}`)
        _this.sendtochild(data.name, data.data)
      })
    },
    sendtochild(dsname, data) {
      if (!this.dataSource[dsname]) {
        console.log('this datasourcename (' + dsname + ') has not been registered')
      } else if (this.dataSource[dsname].length === 0) {
        console.log('widgets binded the datasourcename do not exist')
/*       } else if (dsname === 'map1') {
        let mapData = []
        mapData[0] = this.variableSources.map1[0]
        mapData[1] = data
        this.$set(this.variableSources, dsname, mapData)
        // console.log(this.sources) */
      } else {
        // vm.$set( target, key, value )
        // console.log('else avalible')
        // this.$set(this.testSources, dsname, data)
        // socketServer返回的数据替换sources中的realTimeData
        this.testSources[dsname].realTimeData = data;
      }
    },
    sendtoserv(data) {
      this.socket.emit('bind', data)
    },
    // 绑定实体后
    childbinded(dsname, dsindex) { // from child
      if (!this.dataSource[dsname]) {
        this.dataSource[dsname] = []
        // 将deviceName发给socketserver
        this.sendtoserv(dsname) 
      }
      // console.log('dsindex: ' + dsindex);
      // dsindex意义不明，随便写一个字符串'samedevice+1'
      // this.dataSource[dsname].push(dsindex)   
      this.dataSource[dsname].push('samedevice+1')
      // console.log('dataSource[' + dsname + ']: ' + this.dataSource[dsname])   
    },
    Ctr(data) {
      let dsname = data[0]
      // console.log(dsname)
      data.splice(0, 1)
      // console.log(data);
      this.socket.emit(dsname, data)
    },
    deleted(deleteitem) {
      deleteitem.deleted = true
    }
    // fromserv(dsname, data) {
    //   this.sendtochild(dsname, data)
    // }
  },
  mounted() {
    dragula([this.$refs.showpanel])
    var _this = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        _this.screenWidth = window.screenWidth
        console.log(_this.screenWidth)
      })()
    }
  },
  created() {
    // this.createIo(this.url, io, true)
    this.getSources()
  },
  watch: {
    widgets: function() {
      console.log('widgets are changed')
    },
    screenWidth (val) {
      console.log(val)
      this.screenWidth = val
    }
  }
}
</script>

<style>
.content-body{
  position: absolute;
  height: 100%;
  top: 60px;
  bottom: 40px;
  left: 90px;
  right: 0px;
  /*padding: 20px 0px 50px 90px;*/
}
.widget{
	display: inline-block;
  vertical-align: top;
	width: 22%;
	height: 216px;
	padding: 2px;
	margin: 10px;
	border: 1px solid #eee;
}
.icon-delete{
  float: right;
}
/* Dragula CSS  */
.gu-mirror {
  position: fixed !important;
  margin: 0 !important;
  z-index: 9999 !important;
  opacity: 0.8;
  list-style-type: none;
}

.gu-hide {
  display: none !important;
}

.gu-unselectable {
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
}

.gu-transit {
  opacity: 0.2;
}

</style>