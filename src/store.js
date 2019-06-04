import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const SET_CHOSEN_CLASS = 'setChosenClass'

export const INIT_CHOSEN_CLASS = 'initChosenClass'
export const UPDATE_CHOSEN_CLASS_INS = 'updateChosenClassIns'

const state = {
  chosenClass: {}
}

const getters = {
  chosenClass (state) {
    return state.chosenClass
  }
}

const mutations = {
  [SET_CHOSEN_CLASS] (state, { className, selected }) {
    Vue.set(state.chosenClass, className, selected)
  }
}

const actions = {
  [INIT_CHOSEN_CLASS] ({ commit }, classNames) {
    classNames.forEach(className => {
      commit(SET_CHOSEN_CLASS, { className, selected: null })
    })
  },
  [UPDATE_CHOSEN_CLASS_INS] ({ commit }, { className, selected }) {
    commit(SET_CHOSEN_CLASS, { className, selected })
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
