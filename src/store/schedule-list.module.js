import { addArrayElement, getObjectOrArray, setObjectOrArray } from '@/helper/storage'
import { SCHEDULE_LIST } from '@/helper/storage.type'

import { SCHEDULE_LIST__ADD, SCHEDULE_LIST__REMOVE } from './actions.type'
import { SCHEDULE_LIST__APPEND, SCHEDULE_LIST__ERASE } from './mutations.type'

const state = {
  scheduleList: getObjectOrArray(SCHEDULE_LIST) || []
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
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
