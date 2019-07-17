import Vue from 'vue'
import Vuex from 'vuex'

import arrangeSchedule from './arrange-schedule.module'
import createSchedule from './create-schedule.module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    arrangeSchedule,
    createSchedule
  }
})
