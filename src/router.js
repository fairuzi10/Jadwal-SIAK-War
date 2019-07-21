import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
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
      path: '/schedule/:scheduleId',
      name: 'view-schedule',
      component: () => import('@/pages/ViewSchedule')
    },
    {
      path: '/schedule/:scheduleId/edit',
      name: 'edit-schedule',
      component: () => import('@/pages/EditSchedule')
    },
    {
      path: '/404',
      name: '404',
      component: () => import('@/pages/404')
    },
    {
      path: '*',
      redirect: { name: '404' }
    }
  ]
})

router.pushAsync = route => new Promise((resolve, reject) => router.push(route, resolve, reject))

export default router
