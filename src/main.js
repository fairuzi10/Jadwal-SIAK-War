import Vue from 'vue'
import App from './App.vue'
import store from './store'
import './bootstrap'

Vue.config.productionTip = false

// eslint-disable-next-line no-unused-vars
const VueWebComponent = new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
