import { addArrayElement, getObjectOrArray, setObjectOrArray } from '@/helper/storage'
import { SCHEDULE_LIST } from '@/helper/storage.type'

import {
  SCHEDULE_LIST__ADD,
  SCHEDULE_LIST__CHANGE,
  SCHEDULE_LIST__LOAD_SCHEDULE_LIST_FROM_STORAGE,
  SCHEDULE_LIST__REMOVE
} from './actions.type'
import { SCHEDULE_LIST__APPEND, SCHEDULE_LIST__ERASE, SCHEDULE_LIST__SET } from './mutations.type'

const state = {
  scheduleList: []
}

const getters = {
  scheduleList_scheduleList: state => state.scheduleList
}

const mutations = {
  [SCHEDULE_LIST__APPEND] (state, { id, name, classOptions, chosenClass }) {
    state.scheduleList = [ ...state.scheduleList, { id, name, classOptions, chosenClass } ]
  },
  [SCHEDULE_LIST__ERASE] (state, scheduleId) {
    state.scheduleList = state.scheduleList.filter(schedule => schedule.id !== scheduleId)
  },
  [SCHEDULE_LIST__SET] (state, scheduleList) {
    state.scheduleList = scheduleList
  }
}

const actions = {
  [SCHEDULE_LIST__ADD] ({ commit }, { id, name, classOptions, chosenClass }) {
    commit(SCHEDULE_LIST__APPEND, { id, name, classOptions, chosenClass })
    addArrayElement(SCHEDULE_LIST, { id, name, classOptions, chosenClass })
  },
  async [SCHEDULE_LIST__REMOVE] ({ commit, state }, scheduleId) {
    await commit(SCHEDULE_LIST__ERASE, scheduleId)
    setObjectOrArray(SCHEDULE_LIST, state.scheduleList)
  },
  [SCHEDULE_LIST__CHANGE] ({ commit, state }, schedule) {
    const newScheduleList = state.scheduleList.map(curSchedule => curSchedule.id === schedule.id
      ? schedule : curSchedule)
    commit(SCHEDULE_LIST__SET, newScheduleList)
    setObjectOrArray(SCHEDULE_LIST, newScheduleList)
  },
  [SCHEDULE_LIST__LOAD_SCHEDULE_LIST_FROM_STORAGE] ({ commit }) {
    commit(SCHEDULE_LIST__SET, getObjectOrArray(SCHEDULE_LIST) || [])
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
