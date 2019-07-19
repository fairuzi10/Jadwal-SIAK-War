import { addObjectProperty, getObjectOrArray, setObjectOrArray } from '@/helper/storage'
import { LAST_SEEN_SCHEDULE_NAME, SCHEDULE_LIST } from '@/helper/storage.type'

import { SCHEDULE_LIST__ADD, SCHEDULE_LIST__LOAD_ACTIVE_SEEN_SCHEDULE } from './actions.type'
import { SCHEDULE_LIST__APPEND, SCHEDULE_LIST__SET_ACTIVE_SEEN_SCHEDULE } from './mutations.type'

const state = {
  scheduleList: getObjectOrArray(SCHEDULE_LIST) || {},
  activeSeenSchedule: null
}

const getters = {
  scheduleList_scheduleList: state => state.scheduleList,
  scheduleList_activeSeenSchedule: state => state.activeSeenSchedule
}

const mutations = {
  [SCHEDULE_LIST__APPEND] (state, { scheduleName, schedule }) {
    state.scheduleList = { ...state.scheduleList, [scheduleName]: schedule }
  },
  [SCHEDULE_LIST__SET_ACTIVE_SEEN_SCHEDULE] (state, activeSeenSchedule) {
    state.activeSeenSchedule = activeSeenSchedule
  }
}

const actions = {
  [SCHEDULE_LIST__ADD] ({ commit }, { scheduleName, schedule }) {
    commit(SCHEDULE_LIST__APPEND, { scheduleName, schedule })
    addObjectProperty(SCHEDULE_LIST, scheduleName, schedule)
  },
  [SCHEDULE_LIST__LOAD_ACTIVE_SEEN_SCHEDULE] ({ commit }, activeSeenScheduleName) {
    commit(SCHEDULE_LIST__SET_ACTIVE_SEEN_SCHEDULE, activeSeenScheduleName)
    setObjectOrArray(LAST_SEEN_SCHEDULE_NAME, activeSeenScheduleName)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
