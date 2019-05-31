import Vue from 'vue'
import App from './App.vue'
import store from './store'
import wrap from '@vue/web-component-wrapper'

Vue.config.productionTip = false

const VueWebComponent = new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

const customElement = wrap(Vue, VueWebComponent)
window.customElements.define('jadwal-siak', customElement)
