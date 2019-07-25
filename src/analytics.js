import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import router from './router'

Vue.use(VueAnalytics, {
  id: 'UA-144495086-1',
  router,
  debug: {
    enabled: process.env.NODE_ENV !== 'production',
    sendHitTask: process.env.NODE_ENV === 'production'
  }
})
