import Vue from 'vue'

Vue.mixin({
  methods: {
    isEmptyArray (arr) {
      return !arr || arr.length === 0
    },
    isEmptyObject (obj) {
      return !obj || Object.keys(obj).length === 0
    },
    capitalize (str) {
      return str.split(' ')
        .map(substr => substr.charAt(0).toUpperCase() + substr.substring(1))
        .join(' ')
    }
  }
})
