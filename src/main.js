import Vue from 'vue'
import { exception } from 'vue-analytics'
import App from './App.vue'
import store from './store'
import router from './router'
import './bootstrap-vue'
import './meta-head'
import './analytics'

Vue.config.productionTip = false

// eslint-disable-next-line handle-callback-err
Vue.config.errorHandler = function (err, vm, info) {
  vm.$bvToast.toast(err.message, {
    title: `Terjadi masalah`,
    toaster: 'b-toaster-top-center',
    solid: true,
    appendToast: false,
    headerClass: 'text-center',
    variant: 'danger'
  })
  exception(err.message || err)
}

// eslint-disable-next-line no-unused-vars
const VueWebComponent = new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
