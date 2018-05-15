<template>
<div class="hero-unit">
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Serv</th>
        <th>source</th>
        <th>status</th>
        <th>operate</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for= "(entity,index) in entitylist" :id="entity.entityName">
        <td>{{index}}</td>
        <td>{{entity.entityName}}</td>
        <td>{{entity.servName}}</td>
        <td>{{entity.source}}</td>
        <td><span>{{entity.status}}</span></td>
        <td>
        <input type="button" class="delentity" name="entity.entityName" value="删除">
        </td>
      </tr>
    </tbody>
  </table>
</div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex'
export default{
  name: 'entity-list',
  data() {
    return {
      entitylist: []
    }
  },
  created() {
    this.showlist()
  },
  computed: {
    ...mapGetters([
      'getServIndex'
    ])
  },
  methods: {
    ...mapMutations({
      setEntities: 'SET_ENTITIES',
      pushSource: 'PUSH_SOURCE',  // 把一个entity推入所属的service的sources字段
      initSources: 'INIT_SOURCES'   // 原sources.json
    }),
    showlist: function() {
      var _this = this
      this.$http.get('../../static/entityList.json')
        .then(function(res) {
          var result = res.body.entityList
          _this.entitylist = result
          // entities放入vuex
          _this.setEntities(result)
          // 遍历实体，分别提交到vuex的service.sources[]中并将initialData存入vuex的sources
          var sources = {};
          _this.entitylist.forEach(function(entity, index) {
            // console.log(entity.entityName);
            var servIndex = _this.getServIndex(entity.servName);
            var payload = {
              servIndex: servIndex,
              entity: entity
            }
            _this.pushSource(payload);
            sources[entity.source] = entity.initialData;
          });
          _this.initSources(sources)
        })
    }
  }
}
</script>
<style scoped>
td span {
 color:#88c773;
}
</style>