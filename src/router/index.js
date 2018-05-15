import Vue from 'vue'
import Router from 'vue-router'
import pizzahub from 'views/pizzahub'
import lsce from 'views/lsce'
import servlib from 'views/servlib'
import servDetail from 'components/servDetail'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/lsce'
    },
    {
      path: '/pizzahub',
      name: 'pizzahub',
      component: pizzahub 
    },
    {
      path: '/lsce',
      name: 'lsce',
      component: lsce 
    },
    {
      path: '/servlib',
      name: 'servlib',
      component: servlib
    },
    {
      path: '/servlib/new',
      name: 'servDetail',
      component: servDetail
    },
    {
      path: '/servlib/:servName',
      name: servDetail,
      component: servDetail
    }
  ]
})
