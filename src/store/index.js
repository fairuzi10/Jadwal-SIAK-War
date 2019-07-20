import Vue from 'vue'
import Vuex from 'vuex'

import arrangeSchedule from './arrange-schedule.module'
import createSchedule from './create-schedule.module'
import scheduleList from './schedule-list.module'
import window from './window.module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    arrangeSchedule,
    createSchedule,
    scheduleList,
    window
  }
})
