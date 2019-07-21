import {
  ARRANGE_SCHEDULE__CHOOSE_OR_TOGGLE_CLASS_INSTANCE,
  ARRANGE_SCHEDULE__COMPUTE_FILTERED_CLASS,
  ARRANGE_SCHEDULE__FILTER_CLASS_OPTIONS,
  ARRANGE_SCHEDULE__FILTER_IS_CHOSEN_CLASS,
  ARRANGE_SCHEDULE__LOAD_CLASS_OPTIONS,
  ARRANGE_SCHEDULE__REFRESH,
  ARRANGE_SCHEDULE__RESET_CONFLICT_LIST
} from './actions.type'
import {
  ARRANGE_SCHEDULE__ASSIGN_OR_TOGGLE_CHOSEN_CLASS,
  ARRANGE_SCHEDULE__RESET,
  ARRANGE_SCHEDULE__SET_CLASS_OPTIONS,
  ARRANGE_SCHEDULE__SET_CONFLICT_LIST,
  ARRANGE_SCHEDULE__SET_FILTER,
  ARRANGE_SCHEDULE__SET_FILTER_IS_CHOSEN_CLASS,
  ARRANGE_SCHEDULE__SET_FILTERED_CLASS,
  ARRANGE_SCHEDULE__SET_IS_LOADING_CLASS_OPTONS
} from './mutations.type'
import { matchClass } from './utils/class-filter'
import { validateClasInstanceNotConflict } from './utils/validate-conflict'

const state = {
  classOptions: {},
  filter: '',
  filterChosenClass: false,
  filteredClass: {},
  chosenClass: {},
  isLoadingClassOptions: false,
  conflictList: [],
  // Persist the classOptions and chosenClass when doing create schedule -> view schedule -> create schedule routine
  isCreateSchedule: false
}

const getters = {
  arrangeSchedule_classOptions: state => state.classOptions,
  arrangeSchedule_filter: state => state.filter,
  arrangeSchedule_filterChosenClass: state => state.filterChosenClass,
  arrangeSchedule_filteredClass: state => state.filteredClass,
  arrangeSchedule_chosenClass: state => state.chosenClass,
  arrangeSchedule_isLoadingClassOptions: state => state.isLoadingClassOptions,
  arrangeSchedule_conflictList: state => state.conflictList
}

const mutations = {
  [ARRANGE_SCHEDULE__SET_CLASS_OPTIONS] (state, { classOptions, chosenClass, isCreateSchedule }) {
    state.classOptions = classOptions
    state.chosenClass = chosenClass || Object.keys(classOptions)
      .reduce((acc, className) => ({ ...acc, [className]: null }), {})
    state.filter = ''
    state.filterChosenClass = false
    state.isCreateSchedule = isCreateSchedule
  },
  // used in create schedule
  [ARRANGE_SCHEDULE__SET_IS_LOADING_CLASS_OPTONS] (state, isLoading) {
    state.isLoadingClassOptions = isLoading
  },
  [ARRANGE_SCHEDULE__ASSIGN_OR_TOGGLE_CHOSEN_CLASS] (state, { className, classInstance }) {
    state.chosenClass[className] = classInstance === state.chosenClass[className] ? null : classInstance
  },
  [ARRANGE_SCHEDULE__SET_FILTER] (state, filter) {
    state.filter = filter
  },
  [ARRANGE_SCHEDULE__SET_FILTER_IS_CHOSEN_CLASS] (state, filterChosenClass) {
    state.filterChosenClass = filterChosenClass
  },
  [ARRANGE_SCHEDULE__SET_FILTERED_CLASS] (state, filteredClass) {
    state.filteredClass = filteredClass
  },
  [ARRANGE_SCHEDULE__RESET] (state) {
    state.chosenClass = Object.keys(state.classOptions)
      .reduce((acc, className) => ({ ...acc, [className]: null }), {})
    state.filter = ''
    state.filterChosenClass = false
    state.filteredClass = {}
  },
  [ARRANGE_SCHEDULE__SET_CONFLICT_LIST] (state, conflictList) {
    state.conflictList = conflictList
  }
}

const actions = {
  [ARRANGE_SCHEDULE__LOAD_CLASS_OPTIONS] ({ commit, dispatch }, { classOptions, chosenClass, isCreateSchedule }) {
    commit(ARRANGE_SCHEDULE__SET_CLASS_OPTIONS, { classOptions, chosenClass, isCreateSchedule })
    dispatch(ARRANGE_SCHEDULE__COMPUTE_FILTERED_CLASS)
  },
  [ARRANGE_SCHEDULE__CHOOSE_OR_TOGGLE_CLASS_INSTANCE] ({ commit, state }, { className, classInstance }) {
    const conflictList = validateClasInstanceNotConflict(className, classInstance, state.chosenClass)
    if (conflictList.length === 0) {
      commit(ARRANGE_SCHEDULE__ASSIGN_OR_TOGGLE_CHOSEN_CLASS, { className, classInstance })
    } else {
      commit(ARRANGE_SCHEDULE__SET_CONFLICT_LIST, conflictList)
    }
  },
  [ARRANGE_SCHEDULE__COMPUTE_FILTERED_CLASS] ({ commit, state }) {
    let filteredClass = state.classOptions
    if (state.filter) {
      const filteredClassName = Object.keys(filteredClass).filter(className => matchClass(filteredClass[className], state.filter))
      filteredClass = filteredClassName.reduce((acc, className) => ({
        ...acc, [className]: filteredClass[className]
      }), {})
    }
    if (state.filterChosenClass) {
      filteredClass = Object.keys(filteredClass).reduce((acc, className) => (
        state.chosenClass[className]
          ? { ...acc, [className]: filteredClass[className] }
          : acc
      ), {})
    }
    commit(ARRANGE_SCHEDULE__SET_FILTERED_CLASS, filteredClass)
  },
  [ARRANGE_SCHEDULE__FILTER_CLASS_OPTIONS] ({ commit, dispatch }, filter) {
    commit(ARRANGE_SCHEDULE__SET_FILTER, filter)
    dispatch(ARRANGE_SCHEDULE__COMPUTE_FILTERED_CLASS)
  },
  [ARRANGE_SCHEDULE__FILTER_IS_CHOSEN_CLASS] ({ commit, dispatch }, filterChosen) {
    commit(ARRANGE_SCHEDULE__SET_FILTER_IS_CHOSEN_CLASS, filterChosen)
    dispatch(ARRANGE_SCHEDULE__COMPUTE_FILTERED_CLASS)
  },
  [ARRANGE_SCHEDULE__REFRESH] ({ commit, dispatch, state }) {
    commit(ARRANGE_SCHEDULE__RESET)
    dispatch(ARRANGE_SCHEDULE__COMPUTE_FILTERED_CLASS)
  },
  [ARRANGE_SCHEDULE__RESET_CONFLICT_LIST] ({ commit }) {
    commit(ARRANGE_SCHEDULE__SET_CONFLICT_LIST, [])
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
