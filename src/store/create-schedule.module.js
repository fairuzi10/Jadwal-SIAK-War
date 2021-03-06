import { postHTMLFile } from '@/api'
import { readFile, readHtml } from '@/helper/browser-reader.js'
import { getItem, getObjectOrArray, setItem } from '@/helper/storage'
import { LAST_SELECTED_MAJOR, SCHEDULE_LIST, SUGGESTED_SCHEDULE_NAME } from '@/helper/storage.type'
import { parseTables } from '@/helper/table-parser.js'
import uuidv4 from 'uuid/v4'

import {
  ARRANGE_SCHEDULE__LOAD_CLASS_OPTIONS,
  ARRANGE_SCHEDULE__REFRESH,
  CREATE_SCHEDULE__INIT,
  CREATE_SCHEDULE__LOAD_MAJOR_FROM_STORAGE,
  CREATE_SCHEDULE__LOAD_SUGGESTED_SCHEDULE_NAME_FROM_STORAGE,
  CREATE_SCHEDULE__LOAD_TYPED_SCHEDULE_NAME,
  CREATE_SCHEDULE__REFRESH,
  CREATE_SCHEDULE__SAVE_SCHEDULE,
  CREATE_SCHEDULE__SELECT_MAJOR,
  CREATE_SCHEDULE__UPDATE_SUGGESTED_SCHEDULE_NAME,
  CREATE_SCHEDULE__UPLOAD_FILE,
  CREATE_SCHEDULE__UPLOAD_FILE_TO_BACKEND,
  SCHEDULE_LIST__ADD
} from './actions.type'
import {
  ARRANGE_SCHEDULE__SET_IS_LOADING_CLASS_OPTONS,
  CREATE_SCHEDULE__COMPUTE_CLASS_OPTIONS_FROM_FILE,
  CREATE_SCHEDULE__COMPUTE_CLASS_OPTIONS_FROM_MAJOR,
  CREATE_SCHEDULE__RESET,
  CREATE_SCHEDULE__SET_COMPUTED_FILE,
  CREATE_SCHEDULE__SET_FILE,
  CREATE_SCHEDULE__SET_IS_VALID_FILE,
  CREATE_SCHEDULE__SET_IS_VALID_TYPED_SCHEDULE_NAME,
  CREATE_SCHEDULE__SET_MAJOR,
  CREATE_SCHEDULE__SET_SUBMITTER_NAME,
  CREATE_SCHEDULE__SET_SUGGESTED_SCHEDULE_NAME,
  CREATE_SCHEDULE__SET_TYPED_SCHEDULE_NAME
} from './mutations.type'

const state = {
  file: null,
  isValidFile: null,
  major: '',
  submitterName: '',
  typedScheduleName: '',
  isValidTypedScheduleName: null,
  suggestedScheduleName: 'Plan A',
  computedFile: {}
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
    state.isValidFile = null
    state.isValidTypedScheduleName = null
    state.typedScheduleName = ''
  },
  [CREATE_SCHEDULE__SET_TYPED_SCHEDULE_NAME] (state, typedScheduleName) {
    state.typedScheduleName = typedScheduleName
  },
  [CREATE_SCHEDULE__SET_IS_VALID_TYPED_SCHEDULE_NAME] (state, isValidTypedScheduleName) {
    state.isValidTypedScheduleName = isValidTypedScheduleName
  },
  [CREATE_SCHEDULE__SET_SUGGESTED_SCHEDULE_NAME] (state, suggestedScheduleName) {
    state.suggestedScheduleName = suggestedScheduleName
  },
  [CREATE_SCHEDULE__SET_SUBMITTER_NAME] (state, submitterName) {
    state.submitterName = submitterName
  },
  [CREATE_SCHEDULE__SET_COMPUTED_FILE] (state, computedFile) {
    state.computedFile = computedFile
  }
}

const actions = {
  async [CREATE_SCHEDULE__COMPUTE_CLASS_OPTIONS_FROM_FILE] ({ commit, dispatch, state }) {
    const htmlString = await readFile(state.file)
    const htmlDom = await readHtml(htmlString)
    commit(CREATE_SCHEDULE__SET_COMPUTED_FILE, { str: htmlString, dom: htmlDom })
    const tables = htmlDom.querySelectorAll('table.box')
    const classOptions = await parseTables(tables)
    dispatch(ARRANGE_SCHEDULE__LOAD_CLASS_OPTIONS, { classOptions, isCreateSchedule: true })
  },
  async [CREATE_SCHEDULE__UPLOAD_FILE] ({ commit, dispatch }, file) {
    commit(ARRANGE_SCHEDULE__SET_IS_LOADING_CLASS_OPTONS, true)
    if (file && file.type === 'text/html') {
      commit(CREATE_SCHEDULE__SET_IS_VALID_FILE, true)
      commit(CREATE_SCHEDULE__SET_FILE, file)
      await dispatch(CREATE_SCHEDULE__COMPUTE_CLASS_OPTIONS_FROM_FILE)
    } else {
      commit(CREATE_SCHEDULE__SET_IS_VALID_FILE, false)
      commit(CREATE_SCHEDULE__SET_FILE, null)
      commit(CREATE_SCHEDULE__SET_COMPUTED_FILE, {})
      await dispatch(ARRANGE_SCHEDULE__LOAD_CLASS_OPTIONS, { classOptions: {}, isCreateSchedule: true })
    }
    commit(ARRANGE_SCHEDULE__SET_IS_LOADING_CLASS_OPTONS, false)
  },
  async [CREATE_SCHEDULE__COMPUTE_CLASS_OPTIONS_FROM_MAJOR] ({ commit, dispatch, state }) {
    let classOptions = {}
    let submitterName = ''
    if (state.major) {
      const data = (await import(`@/data/${state.major}.json`)).default
      classOptions = data.classOptions
      submitterName = data.submitterName
    }
    dispatch(ARRANGE_SCHEDULE__LOAD_CLASS_OPTIONS, { classOptions, isCreateSchedule: true })
    commit(CREATE_SCHEDULE__SET_SUBMITTER_NAME, submitterName)
  },
  async [CREATE_SCHEDULE__SELECT_MAJOR] ({ commit, dispatch }, major) {
    commit(ARRANGE_SCHEDULE__SET_IS_LOADING_CLASS_OPTONS, true)
    commit(CREATE_SCHEDULE__SET_MAJOR, major)
    setItem(LAST_SELECTED_MAJOR, major)
    await dispatch(CREATE_SCHEDULE__COMPUTE_CLASS_OPTIONS_FROM_MAJOR)
    commit(ARRANGE_SCHEDULE__SET_IS_LOADING_CLASS_OPTONS, false)
  },
  [CREATE_SCHEDULE__SAVE_SCHEDULE] ({ commit, dispatch, state, rootState }) {
    const scheduleName = state.typedScheduleName || state.suggestedScheduleName
    const existingSchedules = getObjectOrArray(SCHEDULE_LIST) || []
    const scheduleNameAlreadyExists = existingSchedules.filter(schedule => schedule.name === scheduleName).length > 0

    if (scheduleNameAlreadyExists) {
      commit(CREATE_SCHEDULE__SET_IS_VALID_TYPED_SCHEDULE_NAME, false)
      return null
    } else {
      commit(CREATE_SCHEDULE__SET_IS_VALID_TYPED_SCHEDULE_NAME, true)
      const validSchedule = {
        id: uuidv4(),
        name: scheduleName,
        classOptions: rootState.arrangeSchedule.classOptions,
        chosenClass: rootState.arrangeSchedule.chosenClass,
        totalCredit: rootState.arrangeSchedule.totalCredit
      }
      dispatch(SCHEDULE_LIST__ADD, validSchedule)
      dispatch(CREATE_SCHEDULE__UPDATE_SUGGESTED_SCHEDULE_NAME)
      dispatch(CREATE_SCHEDULE__REFRESH)
      dispatch(ARRANGE_SCHEDULE__REFRESH)
      return validSchedule
    }
  },
  [CREATE_SCHEDULE__UPDATE_SUGGESTED_SCHEDULE_NAME] ({ commit, state, rootState }) {
    const curCharAscii = state.suggestedScheduleName.charCodeAt(state.suggestedScheduleName.length - 1) + 1
    const nextCharAscii = Math.max(curCharAscii, rootState.scheduleList.scheduleList.length + 1)
    const nextSuggestedScheduleName = state.suggestedScheduleName.slice(0, -1) + String.fromCharCode(nextCharAscii)
    commit(CREATE_SCHEDULE__SET_SUGGESTED_SCHEDULE_NAME, nextSuggestedScheduleName)
    setItem(SUGGESTED_SCHEDULE_NAME, nextSuggestedScheduleName)
  },
  [CREATE_SCHEDULE__LOAD_SUGGESTED_SCHEDULE_NAME_FROM_STORAGE] ({ commit }) {
    const suggestedScheduleName = getItem(SUGGESTED_SCHEDULE_NAME) || 'Plan A'
    commit(CREATE_SCHEDULE__SET_SUGGESTED_SCHEDULE_NAME, suggestedScheduleName)
  },
  [CREATE_SCHEDULE__REFRESH] ({ commit, state }) {
    commit(CREATE_SCHEDULE__RESET)
  },
  [CREATE_SCHEDULE__LOAD_TYPED_SCHEDULE_NAME] ({ commit }, typedScheduleName) {
    commit(CREATE_SCHEDULE__SET_TYPED_SCHEDULE_NAME, typedScheduleName)
  },
  async [CREATE_SCHEDULE__INIT] ({ dispatch, state, rootState }) {
    if (!rootState.arrangeSchedule.isCreateSchedule) {
      if (state.major) {
        await dispatch(CREATE_SCHEDULE__COMPUTE_CLASS_OPTIONS_FROM_MAJOR)
      } else if (state.file) {
        await dispatch(CREATE_SCHEDULE__COMPUTE_CLASS_OPTIONS_FROM_FILE)
      }
    }
  },
  [CREATE_SCHEDULE__LOAD_MAJOR_FROM_STORAGE] ({ commit }) {
    commit(CREATE_SCHEDULE__SET_MAJOR, getItem(LAST_SELECTED_MAJOR))
  },
  [CREATE_SCHEDULE__UPLOAD_FILE_TO_BACKEND] ({ state }, isAnonymous) {
    if (state.isValidFile) {
      postHTMLFile(state.file, isAnonymous)
    }
  }
}

export default {
  state,
  mutations,
  actions
}
