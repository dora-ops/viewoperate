<template>
	<div>
		<p class="widgetTitle">{{selected}}</p>
    
    <div style="height=200px;position: relative;">
      <div class="mask" v-if="selected">
        <ul>
          <div v-for="item in sources[selected].realTimeData">
            <img class="posDot" :src="sources[selected].staticInfo[1]" :style="{left:(screenWidth*0.22-24)/0.33*(item[0]-109.2)-12.5+'px', top:(200/0.3-24)*(item[1]-18.1)-12.5+'px'}" @click='clickDot("dot", selected, item)'>
          </div>
        </ul>  
      </div>
      
      <img :src="sources[selected].staticInfo[0]" class="ais-widget-img" v-if="selected">
    </div>

    <div v-show="!selected" >
      <select style="width:100px" v-model="selected"  @change="bindFinished(selected)">
        <option :value="null"></option>
        <option v-for="item in entityObjArr" v-bind:value="item.source">
        {{item.entityName}}({{item.source}})
        </option>
      </select>
      <img src="../../../static/image/location.png" style="display:block; width:100px; height:100px; margin:20px auto">
    </div>
	</div>
</template>

<script>
  export default{
    data () {
      return {
        selected: ''
      }
    },
    props: ['sources', 'entityObjArr', 'index', 'screenWidth'],
    methods: {
      bindFinished(value) {
        this.$emit('binded', value, this.index)
      },
      clickDot(ev, dsname, item) {
        var data = []
        data[0] = ev
        data[1] = dsname
        data[2] = item 
        this.$emit('childcontrol', data)
      }
    }
  }
</script>

<style>
.ais-widget-img{
    width: 100%;
    height: 200px;
    background-repeat: no-repeat;
    overflow: scroll;
    /*float: left;*/
}
.widgetTitle{
  text-align: center;
}
.mask{
  width: 100%;
  position: absolute;
  height: 200px;
  background-color: transparent;
  float: left;
}
.posDot{
  width:25px; 
  height:25px; 
  position:absolute;
}
</style>