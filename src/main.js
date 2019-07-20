import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './bootstrap-vue'

Vue.config.productionTip = false

// eslint-disable-next-line no-unused-vars
const VueWebComponent = new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
