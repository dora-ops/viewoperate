<template>
<div>
  <p class="widgetTitle">{{selected}}</p>
  <div :id='this.id'></div>
	
	<div v-if="entityObjArr != ''">
      <div v-show="!selected">
        <select style="width:100px" v-model="selected" @change="bindFinished(selected)">
          <option :value="null"></option>
          <option v-for="item in entityObjArr" v-bind:value="item.source">
          {{item.entityName}}({{item.source}})
          </option>
        </select>
	  </div>
	</div>
</div>
</template>

<script>
import Highcharts from 'highcharts/highstock'

export default {
  props: ['entityObjArr', 'sources', 'index'],
  data() { 
    return {
      selected: '',
      chart: null,
      id: 'chart' + this.index
    }
  },
  methods: {
    bindFinished(value) {
      this.init(value)
      this.$emit('binded', value, this.index)
    },
    init(sourcename) {
      Highcharts.setOptions({
        global: {
          useUTC: false
        }
      })
      let _this = this
      this.chart = new Highcharts.StockChart(this.id, {
        chart: {
          height: '200px',
          events: {
            load: function () {
              // set up the updating of the chart each second
              var series = this.series[0]
              setInterval(function () {
                // var x = (new Date()).getTime()
                // new Date((new Date()).getTime() - 1000) // 手动加时延
                var x = _this.dataX || null
                var y = _this.dataY || null
                series.addPoint([x, y], true, true)
              }, 1000)
            }
          }
        },
        rangeSelector: {
          buttons: [{
            count: 1,
            type: 'minute',
            text: '1M'
          }, {
            count: 5,
            type: 'minute',
            text: '5M'
          }, {
            type: 'all',
            text: 'All'
          }],
          buttonTheme: { // styles for the buttons
            fill: 'none',
            // stroke: 'none',
            // 'stroke-width': 0,
            r: 8,
            style: {
              color: '#0e90d2',
              fontWeight: 'bold',
              fontSize: '10px'
            },
            states: {
              hover: {
              },
              select: {
                fill: '#0e90d2',
                style: {
                  color: 'white'
                }
              }
            }
          },
          inputEnabled: false,
          selected: 0
        },
        // title: {
        //   text: sourcename,
        //   margin: 5,
        //   style: {
        //     'fontSize': '12px'
        //   }
        // },
        exporting: {
          enabled: false
        },
        series: [{
          name: 'initial data',
          data: (function () {
            // generate an array of random data
            var data = []
            var time = (new Date()).getTime()
            var i
            for (i = -999; i <= 0; i += 1) {
              data.push([
                time + i * 1000,
                0
              ])
            }
            return data
          }())
        }]
      })
    }
  },
  watch: {
    // dataY(value) {
    //   console.log(`new data from ${this.selected}: ${value}`)
    // }
  },
  computed: {
    dataX() {
      return this.sources[this.selected].realTimeData[0]
    },
    dataY() {
      return this.sources[this.selected].realTimeData[1]
    }
  }
}
</script>

<style>
  .widgetTitle{
    text-align: center;
  }
</style>