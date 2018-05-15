<template>
<div class="hero-unit">
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>icon</th>
        <th>title</th>
        <th>operate</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for= "(service,index) in servicelist" :id="service.servName">
        <td>{{index}}</td>
        <td>
        <img :src='service.iconImg' />
        </td>
        <td>
          <router-link :to="service.url" @click.native="clickServ">{{service.listName}} / {{service.servName}}</router-link>
        </td>
        <td>
        <input type="button" value="删除" @click="delServ(index)">
        </td>
      </tr>
    </tbody>
  </table>
</div>

</template>
<script>
// import Bus from 'common/js/bus.js';  
import {mapMutations, mapGetters} from 'vuex'
export default{
  name: 'service-list',
  data() {
    return {
      servicelist: []
    }
  },
  created() {
    this.showlist()
  },
  computed: {
    ...mapGetters([
    ])
  },
  methods: {
    ...mapMutations({
      setServices: 'SET_SERVICES',
      setSDMode: 'SET_SDMODE',
      delService: 'DEL_SERVICE'
    }),
    showlist: function() {
      var _this = this
      this.$http.get('../../static/pizzahubListNew.json')
                .then(function(res) {
                  var result = res.body.list
                  // 加入sources字段
                  result.forEach(function(service, index) {
                    service.sources = [];
                  })
                  // 放入vuex store
                  _this.setServices(result)
                  /* 不知道怎样拼接嵌套动态匹配路由，所以在servicelist[]中添加url属性 */
                  for (var i = 0; i < result.length; i++) {
                    result[i].url = '/servlib/' + result[i].servName
                  }
                  /****************************************************************/
                  _this.servicelist = result
                })
    },
    clickServ: function() {
      // Bus.$emit('getTarget', event.target);  
      this.setSDMode('info')
    },
    delServ: function(index) {
      var delServArr = this.servicelist.splice(index, 1);
      // eslint-disable-next-line
      var delServName = delServArr[0].servName;
      // 向后台服务器发起删除请求
      // vuex
      this.delService(index);
    }
  }
}
</script>

<style type="text/css">
td {
    padding-top: 20px;
}
.hero-unit {
    font-size: 18px;
    font-weight: 200;
    line-height: 30px;
    color: inherit;
    background-color: #eeeeee;
}
table {
    width: 100%;
    margin-bottom: 20px;
    max-width: 100%;
    background-color: transparent;
    border-collapse: collapse;
    border-spacing: 0;
    border-color: grey;
}
thead {
    display: table-header-group;
    vertical-align: middle;
    border-color: inherit;
}
table th {
    font-weight: bold;
}
tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
}
tbody {
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
}
table th, table td {
    padding: 8px;
    line-height: 20px;
    text-align: left;
    vertical-align: top;
    border-top: 1px solid #dddddd;
}
td img {
    width: 25px;
}
</style>