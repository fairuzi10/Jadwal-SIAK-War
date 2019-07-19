import { readFile, readHtml } from '@/helper/reader.js'
import { getItem, getObjectOrArray } from '@/helper/storage'
import { SCHEDULE_LIST, SUGGESTED_SCHEDULE_NAME } from '@/helper/storage.type'
import { parseTables } from '@/helper/table-parser.js'

import {
  ARRANGE_SCHEDULE__LOAD_CLASS_OPTIONS,
  CREATE_SCHEDULE__LOAD_TYPED_SCHEDULE_NAME,
  CREATE_SCHEDULE__REFRESH,
  CREATE_SCHEDULE__SAVE_SCHEDULE,
  CREATE_SCHEDULE__SELECT_MAJOR,
  CREATE_SCHEDULE__UPLOAD_FILE,
  SCHEDULE_LIST__ADD,
  SCHEDULE_LIST__LOAD_ACTIVE_SEEN_SCHEDULE
} from './actions.type'
import {
  ARRANGE_SCHEDULE__SET_IS_LOADING_CLASS_OPTONS,
  CREATE_SCHEDULE__RESET,
  CREATE_SCHEDULE__SET_FILE,
  CREATE_SCHEDULE__SET_IS_VALID_FILE,
  CREATE_SCHEDULE__SET_MAJOR,
  CREATE_SCHEDULE__SET_TYPED_SCHEDULE_NAME
} from './mutations.type'

const state = {
  file: null,
  isValidFile: null,
  major: '',
  typedScheduleName: '',
  isValidTypedScheduleName: null,
  suggestedScheduleName: getItem(SUGGESTED_SCHEDULE_NAME) || 'Plan A'
}

const getters = {
  createSchedule_file: state => state.file,
  createSchedule_isValidFile: state => state.isValidFile,
  createSchedule_major: state => state.major,
  createSchedule_suggestedScheduleName: state => state.suggestedScheduleName,
  createSchedule_isValidTypedScheduleName: state => state.isValidTypedScheduleName
}

const mutations = {
  [CREATE_SCHEDULE__SET_FILE] (state, file) {
    state.file = file
  },
  [CREATE_SCHEDULE__SET_MAJOR] (state, major) {
    state.major = major
  },
  [CREATE_SCHEDULE__SET_IS_VALID_FILE] (state, isValid) {
    state.isValidFile = isValid
  },
  [CREATE_SCHEDULE__RESET] (state) {
    state.file = null
    state.major = ''
    state.isValidFile = null
  },
  [CREATE_SCHEDULE__SET_TYPED_SCHEDULE_NAME] (state, typedScheduleName) {
    state.typedScheduleName = typedScheduleName
  }
}

const actions = {
  async [CREATE_SCHEDULE__UPLOAD_FILE] ({ commit, dispatch }, file) {
    commit(ARRANGE_SCHEDULE__SET_IS_LOADING_CLASS_OPTONS, true)
    if (file && file.type === 'text/html') {
      commit(CREATE_SCHEDULE__SET_IS_VALID_FILE, true)
      commit(CREATE_SCHEDULE__SET_FILE, file)
      const htmlString = await readFile(file)
      const htmlDom = await readHtml(htmlString)
      const tables = htmlDom.querySelectorAll('table.box')
      const classOpt = await parseTables(tables)
      dispatch(ARRANGE_SCHEDULE__LOAD_CLASS_OPTIONS, classOpt)
    } else {
      commit(CREATE_SCHEDULE__SET_IS_VALID_FILE, false)
      commit(CREATE_SCHEDULE__SET_FILE, null)
      dispatch(ARRANGE_SCHEDULE__LOAD_CLASS_OPTIONS, {})
    }
    commit(ARRANGE_SCHEDULE__SET_IS_LOADING_CLASS_OPTONS, false)
  },
  async [CREATE_SCHEDULE__SELECT_MAJOR] ({ commit, dispatch }, major) {
    commit(CREATE_SCHEDULE__SET_MAJOR, major)
    commit(ARRANGE_SCHEDULE__SET_IS_LOADING_CLASS_OPTONS, true)
    if (major) {
      const classOpt = (await import(`@/data/${major}.json`)).default
      dispatch(ARRANGE_SCHEDULE__LOAD_CLASS_OPTIONS, classOpt)
    } else {
      dispatch(ARRANGE_SCHEDULE__LOAD_CLASS_OPTIONS, {})
    }
    commit(ARRANGE_SCHEDULE__SET_IS_LOADING_CLASS_OPTONS, false)
  },
  [CREATE_SCHEDULE__SAVE_SCHEDULE] ({ commit, dispatch, state, rootState }) {
    const scheduleName = state.typedScheduleName || state.suggestedScheduleName
    const existingSchedule = getObjectOrArray(SCHEDULE_LIST) || {}
    if (scheduleName in existingSchedule) {
      this.isValidTypedScheduleName = false
    } else {
      this.isValidTypedScheduleName = true
      dispatch(SCHEDULE_LIST__ADD, {
        scheduleName,
        schedule: {
          classOptions: state.arrangeSchedule.classOptions,
          chosenClass: rootState.arrangeSchedule.chosenClass
        }
      })
      dispatch(SCHEDULE_LIST__LOAD_ACTIVE_SEEN_SCHEDULE, scheduleName)
      dispatch(CREATE_SCHEDULE__REFRESH)
    }
  },
  [CREATE_SCHEDULE__REFRESH] ({ commit, state }) {
    commit(CREATE_SCHEDULE__RESET)
  },
  [CREATE_SCHEDULE__LOAD_TYPED_SCHEDULE_NAME] ({ commit }, typedScheduleName) {
    commit(CREATE_SCHEDULE__SET_TYPED_SCHEDULE_NAME, typedScheduleName)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
