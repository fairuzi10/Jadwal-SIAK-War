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
import { deepClone, isSameClassInstance } from '@/helper/utils'

const state = {
  classOptions: {},
  filter: '',
  filterChosenClass: false,
  filteredClass: {},
  chosenClass: {},
  isLoadingClassOptions: false,
  conflictList: [],
  // Persist the classOptions and chosenClass when doing create schedule -> view schedule -> create schedule routine
  isCreateSchedule: false,
  totalCredit: 0
}

const mutations = {
  [ARRANGE_SCHEDULE__SET_CLASS_OPTIONS] (state, { classOptions, chosenClass, isCreateSchedule }) {
    state.classOptions = deepClone(classOptions)
    state.chosenClass = deepClone(chosenClass) || Object.keys(classOptions)
      .reduce((acc, className) => ({ ...acc, [className]: null }), {})
    state.filter = ''
    state.filterChosenClass = false
    state.isCreateSchedule = isCreateSchedule
    state.totalCredit = chosenClass
      ? Object.keys(chosenClass).reduce((acc, className) => chosenClass[className] ? acc + classOptions[className].credit : acc, 0)
      : 0
  },
  // used in create schedule
  [ARRANGE_SCHEDULE__SET_IS_LOADING_CLASS_OPTONS] (state, isLoading) {
    state.isLoadingClassOptions = isLoading
  },
  [ARRANGE_SCHEDULE__ASSIGN_OR_TOGGLE_CHOSEN_CLASS] (state, { className, classInstance }) {
    let assignedClassInstance = null
    if (classInstance) {
      assignedClassInstance = isSameClassInstance(classInstance, state.chosenClass[className]) ? null : classInstance
    }
    if (assignedClassInstance && !state.chosenClass[className]) {
      state.totalCredit += state.classOptions[className].credit
    } else if (!assignedClassInstance) {
      state.totalCredit -= state.classOptions[className].credit
    }
    state.chosenClass[className] = assignedClassInstance
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
    state.totalCredit = 0
  },
  [ARRANGE_SCHEDULE__SET_CONFLICT_LIST] (state, conflictList) {
    state.conflictList = deepClone(conflictList)
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
  mutations,
  actions
}
