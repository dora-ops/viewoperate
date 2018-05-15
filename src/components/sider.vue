<template>
<div>
    <div v-show="siderStatus" class="menu-wrap" >
        <div class="searchbar">
            <input class="search-input" type="text" name="searchbar" placeholder="请输入你要搜索的组件名称" autocomplete="on">
            <button id="searchstart" type="submit" class="searchbtn">search</button>
        </div>
   
        <div v-for="(item,index) in list" class="library-section">
            <div class="menu-header">
                <a>{{item.listName}}</a>
                <span class="iconfont icon-more" v-show="!item.displayFlag" @click="toggleDisplay(item)"></span>
                <span class="iconfont icon-moreunfold" v-show="item.displayFlag" @click="toggleDisplay(item)"></span>
                <!-- <div style="clear:both;"></div> -->
            </div>
            <div class="library-content" v-show="item.displayFlag">
                <ul class="liblist">    
                    <div v-for="i in item.listContent" class="library-module dragicon" draggable="true" @dragend="dragend(i)">
                        <img class="libicon" :src="i.iconImg"></img>
                        <a class="serv-name" title="">{{i.servName}}</a>
                    </div>
                    <div style="clear:both;"></div>
                </ul>
            </div>
        </div>
        
        <span class="iconfont icon-close close-button" @click="closeSider"></span>
    </div>
    <button class="menu-button" id="open-button" @click="openSider"></button>

</div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
export default{
  name: 'sider',
  data() {
    return {
      list: [],
      siderStatus: false
    }
  },
  created() {
    this.showlist()
  },
  computed: {
    ...mapGetters([
      'services'
    ])
  },
  methods: {
    ...mapMutations({
    }),
    showlist: function() {
      var _this = this

      // 从pizzahubList.json
      /* this.$http.get('../../static/pizzahubList.json').then(function(res) {
        console.log('old' + res)
         _this.list = res.body.result.list
      }) */

        // 从类数据库pizzahubListNew.json读list
      /* this.$http.get('../../static/pizzahubListNew.json').then(function(res) {
        var result = res.body.list */

        // 从vuex中读services
      var result = this.services;

        // 从数据库读取list
        /* this.$http.get('http://localhost:3000/db/getServices').then(function(res) {
        var result = res.body; */

        // 改写list 符合原样式
      var reList = [] // 一维数组,每项是一个分类
      var listNames = []
      var tmpArr = [] // 二维数组，按服务类型对服务分类
      for (var i = 0; i < result.length; i++) {
        var index = _this.isInArray(result[i].listName, listNames)
        if (index === -1) {
          // 不在数组中
          index = listNames.length 
          listNames.push(result[i].listName)
          tmpArr.push([])
        } 
        tmpArr[index].push(result[i]) 
      }
      // console.log('listNames:' + listNames)
      // console.log('tmpArr:' + tmpArr)
      for (var j = 0; j < listNames.length; j++) {
        var tmpObject = {}
        tmpObject.listName = listNames[j]
        tmpObject.listContent = tmpArr[j]
        reList.push(tmpObject)
      }
      // console.log(reList)
      _this.list = reList
     //  }) 
    },
    isInArray: function(item, arr) {
      for (var i = 0; i < arr.length; i++) {
        if (item === arr[i]) {
            // 在数组中
          return i
        } 
      }
      return -1
    },
    toggleDisplay: function(item) {
      if (typeof item.displayFlag === 'undefined') {
        this.$set(item, 'displayFlag', true)
      } else {
        item.displayFlag = !item.displayFlag
      }
    },
    closeSider: function() {
      this.siderStatus = false
    },
    openSider: function() {
      this.siderStatus = true
    },
    dragend: function(i) {
      event.preventDefault()
      // console.log(i.servName)
      this.$emit('droped', i)
    }
  }
}
</script>

<style type="text/css">

.menu-wrap{
    position: absolute;
    top: 40px;
    bottom: 0;
    z-index: 1001;
    width: 330px;
    /* background: #373a47; */
    background: #fbfbff;
    padding: 20px 10px 10px;
    overflow: scroll;
    font-size: 1em;
/*    -webkit-transform: translate3d(-380px,0,0);
    transform: translate3d(-320px,0,0);
    -webkit-transition: -webkit-transform 0.4s;
    transition: transform 0.4s;
    -webkit-transition-timing-function: cubic-bezier(0.7,0,0.3,1);
    transition-timing-function: cubic-bezier(0.7,0,0.3,1);*/
}
.searchbar{
    margin-bottom: 10px;
}
.search-input{
    width: 180px;
    margin-left: 30px;
    font-size: 13px;
    padding: 5px 10px; 
}
.searchbtn{
    font-size: 13px;
    margin-left: 10px; 
}
.library-section{
    line-height: 25px;
    display: block;
    width: 100%;
}
.menu-header{
    border: 1px solid #aaa;
    border-radius: 4px;
    padding-left: 1em;
    font-size: 14px;
    margin: 10px 15px 10px 0;
}
.menu-header span{
    line-height: 25px;
    float: right;
    padding-right: 10px;
}
.library-content{
    display: block;
}
.liblist{
    padding-top: 10px;
    display: block;
    padding-left: 0px;
}
.library-module{
    float: left;
    margin-bottom: 10px;
    width: 70px;
    text-align: center;
    overflow: hidden; /*名字太长*/
}
.close-button{
    width: 2em;
    height: 2em;
    position: absolute;
    right: 10px;
    top: 10px;
    overflow: hidden;
    text-indent: 1em;
    font-size: 1em;
    border: none;
    background: transparent;
    /*color: transparent;*/
}
.menu-button{
    position: fixed;
    top: 40px;
    z-index: 1000;
    margin: 1em;
    padding: 0;
    width: 2.5em;
    height: 2.25em;
    border: none;
    text-indent: 2.5em;
    font-size: 1.5em;
    color: transparent;
    background: transparent;
}
.menu-button::before {
    position: absolute;
    top: 0.5em;
    right: 0.5em;
    bottom: 0.5em;
    left: 0.5em;
    background: linear-gradient(#373a47 20%, transparent 20%, transparent 40%, #373a47 40%, #373a47 60%, transparent 60%, transparent 80%, #373a47 80%);
    content: '';
}
.menu-button:hover {
    opacity: 0.6;
}
.libicon{
    background-position: 0px 0px;
    margin: 0 auto;
    background-size:50px 50px;
    width: 50px;
    height: 50px;
}
.serv-name{
    display: block; /*名字太短*/
    color: #aaa;
    font-weight: normal;
    font-size: 11px;
    line-height: 15px; /*为了让字母g显示完全，不用11px*/
}   
/*.show-menu .menu-wrap {
    -webkit-transform: translate3d(0,0,0);
    transform: translate3d(0,0,0);
    -webkit-transition: -webkit-transform 0.8s;
    transition: transform 0.8s;
    -webkit-transition-timing-function: cubic-bezier(0.7,0,0.3,1);
    transition-timing-function: cubic-bezier(0.7,0,0.3,1);
}*/
</style>

