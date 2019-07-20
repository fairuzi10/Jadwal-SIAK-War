import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/Home')
    },
    {
      path: '/create',
      name: 'create-schedule',
      component: () => import('@/pages/CreateSchedule')
    },
    {
      path: '/view/:scheduleId',
      name: 'view-schedule',
      component: () => import('@/pages/ViewSchedule')
    }
  ]
})
