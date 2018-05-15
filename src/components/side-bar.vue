<template>

<div class="sidebar-nav">
    <ul class="nav-list">
        <li class="nav-header">MENU</li>
        <li v-for="(item,index) in list" :class="item">
          <a href="#" v-on:click="clickTab" id="item+'Tab'">{{item}}</a>
        </li>
    </ul>
</div>

</template>
<script>
export default{
  name: 'side-bar',
  data() {
    return {
      list: ['Services', 'Entities', 'Projects'],
      clickWhich: ''
    }
  },
  methods: {
    clickTab: function() {
      this.clickWhich = event.currentTarget.innerText;
      // console.log(this.clickWhich);
      this.$emit('clickTab', {clickWhich: this.clickWhich});
      // 清除所有标签active,待改进
      var parentul = event.currentTarget.parentNode.parentNode;
      var len = parentul.children.length;
      for (var i = 1; i < len; i++) {
        parentul.children[i].className = '';
      }
      // 改变本标签样式
      event.currentTarget.parentNode.className = 'active';
    }
  }
 /* mounted() {
    var servTab = documemt.getElementById('ServicesTab');
    servTab.click();
  }
  */
}
</script>

<style type="text/css">
.sidebar-nav {
  position: absolute;
  width: 200px;
  top: 45px;
  padding: 19px;
  background-color: #f5f5f5;
  border: 1px solid #e3e3e3;
}
.nav-header {
  font-weight: bold;
  color: #999999;
  display: block;
  padding: 3px 15px;
  font-size: 11px;
  line-height: 20px;
}
.nav-list{
  padding-right: 0px;
  padding-left: 0px;
}
.nav-list li {
  padding: 3px 0;
  line-height: 20px;
}
.nav-list .nav-header {
  font-weight: bold;
  color: #999999;
  display: block;
  padding: 3px 15px;
  font-size: 11px;
  line-height: 20px;
}
.nav-list>li>a {
  margin: 0 auto;
  padding: 3px 15px;
  display: block;
  width: 100%;
}
a{
  color: #00B7ff;
}
.active>a {
  color: #ffffff;
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.2); 
  background-color: #0088cc;
}
</style>