// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'common/stylus/index.styl'
import VueResource from 'vue-resource'
import store from './store'
import VueHighcharts from 'vue-highcharts'
import Highcharts from 'highcharts'
// import '../static/jsmpg.js'

// loadStock(Highcharts)
Vue.use(VueHighcharts, {Highcharts})
Vue.use(VueResource) 
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
