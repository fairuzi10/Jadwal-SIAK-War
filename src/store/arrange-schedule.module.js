import {
  CHOOSE_CLASS_INS_OR_TOGGLE,
  COMPUTE_FILTERED_CLASS,
  FILTER_CHOSEN_CLASS_OPT,
  FILTER_CLASS_OPT,
  RESET_ARRANGE_CLASS
} from './actions.type'
import {
  ASSIGN_ELEMENT_CHOSEN_CLASS_OR_TOGGLE,
  IS_LOADING_CLASS_OPT,
  SET_CLASS_OPT,
  SET_FILTER_CHOSEN_CLASS_OPT,
  SET_FILTER_CLASS_OPT,
  SET_FILTERED_CLASS
} from './mutations.type'
import { matchClass } from './utils/class.filter'

const state = {
  classOpt: {},
  filter: '',
  filterChosen: false,
  filteredClass: {},
  chosenClass: {},
  isLoadingClassOpt: false
}

const getters = {
  classOpt: state => state.classOpt,
  filter: state => state.filter,
  filterChosen: state => state.filterChosen,
  filteredClass: state => state.filteredClass,
  chosenClass: state => state.chosenClass,
  isLoadingClassOpt: state => state.isLoadingClassOpt
}

const mutations = {
  [SET_CLASS_OPT] (state, classOpt) {
    state.classOpt = classOpt
    state.chosenClass = Object.keys(classOpt)
      .reduce((acc, className) => ({ ...acc, className: null }), {})
    state.filter = ''
    state.filterChosen = false
  },
  // used in create schedule
  [IS_LOADING_CLASS_OPT] (state, isLoading) {
    state.isLoadingClassOpt = isLoading
  },
  [ASSIGN_ELEMENT_CHOSEN_CLASS_OR_TOGGLE] (state, { className, classIns }) {
    state.chosenClass[className] = classIns === state.chosenClass[className] ? null : classIns
  },
  [SET_FILTER_CLASS_OPT] (state, filter) {
    state.filter = filter
  },
  [SET_FILTER_CHOSEN_CLASS_OPT] (state, filterChosen) {
    state.filterChosen = filterChosen
  },
  [SET_FILTERED_CLASS] (state, filteredClass) {
    state.filteredClass = filteredClass
  }
}

const actions = {
  [SET_CLASS_OPT] ({ commit, dispatch }, classOpt) {
    commit(SET_CLASS_OPT, classOpt)
    dispatch(COMPUTE_FILTERED_CLASS)
  },
  [CHOOSE_CLASS_INS_OR_TOGGLE] ({ commit }, { className, classIns }) {
    commit(ASSIGN_ELEMENT_CHOSEN_CLASS_OR_TOGGLE, { className, classIns })
  },
  [COMPUTE_FILTERED_CLASS] ({ commit, state }) {
    let filteredClass = state.classOpt
    if (state.filter) {
      const filteredClassName = Object.keys(filteredClass).filter(className => matchClass(filteredClass[className], state.filter))
      filteredClass = filteredClassName.reduce((acc, className) => ({
        ...acc, [className]: filteredClass[className]
      }), {})
    }
    if (state.filterChosen) {
      filteredClass = Object.keys(filteredClass).reduce((acc, className) => (
        state.chosenClass[className]
          ? { ...acc, [className]: filteredClass[className] }
          : acc
      ), {})
    }
    commit(SET_FILTERED_CLASS, filteredClass)
  },
  [FILTER_CLASS_OPT] ({ commit, dispatch }, filter) {
    commit(SET_FILTER_CLASS_OPT, filter)
    dispatch(COMPUTE_FILTERED_CLASS)
  },
  [FILTER_CHOSEN_CLASS_OPT] ({ commit, dispatch }, filterChosen) {
    commit(SET_FILTER_CHOSEN_CLASS_OPT, filterChosen)
    dispatch(COMPUTE_FILTERED_CLASS)
  },
  [RESET_ARRANGE_CLASS] ({ commit, dispatch, state }) {
    commit(SET_CLASS_OPT, state.classOpt)
    dispatch(COMPUTE_FILTERED_CLASS)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
