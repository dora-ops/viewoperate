<template>
<div>
  <p class="widgetTitle">{{selected}}</p>
  <div v-if="entityObjArr != ''">
    <div v-show="!selected">
      <select style="width:100px" v-model="selected" @change="bindFinished(selected)">
        <option v-for="item in entityObjArr" v-bind:value="item.source">
        {{item.entityName}}({{item.source}})
        </option>
      </select>
	</div>
  </div>
  <!-- 此模板真正内容 -->
  <p v-if="selected">{{sources[selected].realTimeData}}</p>
</div>
</template>

<script>
export default {
  data () {
    return {
      selected: ''
    }
  },
  props: ['text', 'sources', 'entityObjArr'],
  methods: {
    bindFinished(value) { // 获取绑定的数据源名称
      // console.log(value)
      // index是什么？ 传过去的是undefined
      this.$emit('binded', value, this.index)
    }
  }
}
</script>

<style>
.widgetTitle{
  text-align: center;
}
</style>