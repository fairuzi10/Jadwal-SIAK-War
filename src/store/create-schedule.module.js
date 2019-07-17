import { readFile, readHtml } from '@/helper/reader.js'
import { parseTables } from '@/helper/table-parser.js'

import { SELECT_MAJOR, SET_CLASS_OPT, UPLOAD_SCHEDULE_FILE } from './actions.type'
import { IS_LOADING_CLASS_OPT, SET_CREATE_SCHEDULE_FILE, SET_CREATE_SCHEDULE_MAJOR } from './mutations.type'

const state = {
  file: null,
  major: ''
}

const getters = {
  createScheduleFile: state => state.file,
  createScheduleMajor: state => state.major
}

const mutations = {
  [SET_CREATE_SCHEDULE_FILE] (state, file) {
    state.file = file
  },
  [SET_CREATE_SCHEDULE_MAJOR] (state, major) {
    state.major = major
  }
}

const actions = {
  async [UPLOAD_SCHEDULE_FILE] ({ commit, dispatch }, file) {
    commit(SET_CREATE_SCHEDULE_FILE, file)
    commit(IS_LOADING_CLASS_OPT, true)
    if (file) {
      const htmlString = await readFile(file)
      const htmlDom = await readHtml(htmlString)
      const tables = htmlDom.querySelectorAll('table.box')
      const classOpt = await parseTables(tables)
      dispatch(SET_CLASS_OPT, classOpt)
    } else {
      dispatch(SET_CLASS_OPT, {})
    }
    commit(IS_LOADING_CLASS_OPT, false)
  },
  async [SELECT_MAJOR] ({ commit, dispatch }, major) {
    commit(SET_CREATE_SCHEDULE_MAJOR, major)
    commit(IS_LOADING_CLASS_OPT, true)
    if (major) {
      const classOpt = (await import(`@/data/${major}.json`)).default
      dispatch(SET_CLASS_OPT, classOpt)
    } else {
      dispatch(SET_CLASS_OPT, {})
    }
    commit(IS_LOADING_CLASS_OPT, false)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
