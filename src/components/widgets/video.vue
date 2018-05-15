<template>
<div>
	<p class="widgetTitle">{{selected}}</p>
	<canvas class="videoCanvas" :id="id" v-show="selected"></canvas>

	<div v-if="entityObjArr != ''">
    <div v-show="!selected">
      <select style="width:100px" v-model="selected" @change="bindFinished(selected)">
        <option v-for="item in entityObjArr" v-bind:value="item.source">
        {{item.entityName}}({{item.source}})
        </option>
      </select>
      <img src="../../../static/image/camera-background.png" style="display:block; width:100px; height:100px; margin:20px auto">
	  </div>
  </div>
</div>
</template>


<script>
import Jsmpeg from 'common/js/jsmpg.js'

export default {
  props: ['entityObjArr', 'sources', 'index'],
  data() {
    return {
      selected: '',
      id: 'canvas' + this.index
    }
  },
  methods: {
    bindFinished(selected) { // 获取绑定的数据源名称
      this.connect(selected)
      console.log(selected)
      this.$emit('binded', selected, this.index)
    },
    connect(selected) {
      let url = 'ws://' + this.sources[selected].staticInfo
      console.log(url)
      let client = new WebSocket(url)
      let canvas = document.getElementById(this.id)
      let player = new Jsmpeg(client, {canvas: canvas})
      console.log(player)
    }
  }
}
</script>

<style>
	.videoCanvas{
		height: 200px;
		width: 100%;
	}
	.widgetTitle{
    text-align: center;
  }
</style>