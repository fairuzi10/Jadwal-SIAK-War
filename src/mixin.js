import Vue from 'vue'

Vue.mixin({
  methods: {
    isEmptyArray (arr) {
      return !arr || arr.length === 0
    },
    isEmptyObject (obj) {
      return !obj || Object.keys(obj).length === 0
    }
  }
})
