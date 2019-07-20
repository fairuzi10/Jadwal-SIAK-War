import { WINDOW__RESIZED } from './actions.type'
import { WINDOW__SET_DIMENSION } from './mutations.type'

const state = {
  height: 0,
  width: 0
}

const getters = {
  window_height: state => state.height,
  window_width: state => state.width
}

const mutations = {
  [WINDOW__SET_DIMENSION] (state, { height, width }) {
    state.height = height
    state.width = width
  }
}

const actions = {
  [WINDOW__RESIZED] ({ commit }) {
    commit(WINDOW__SET_DIMENSION, {
      height: window.innerHeight,
      width: window.innerWidth
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
