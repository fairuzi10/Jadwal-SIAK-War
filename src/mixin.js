import Vue from 'vue'

Vue.mixin({
  data () {
    return {
      breakpoint: {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200
      }
    }
  },
  methods: {
    isEmptyArray (arr) {
      return !arr || arr.length === 0
    },
    isEmptyObject (obj) {
      return !obj || Object.keys(obj).length === 0
    },
    allValueOfObjectIsNull (obj) {
      return !obj || Object.keys(obj).filter(key => obj[key]).length === 0
    },
    capitalize (str) {
      return str.split(' ')
        .map(substr => substr.charAt(0).toUpperCase() + substr.substring(1))
        .join(' ')
    },
    scrollToTop () {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    },
    scrollIntoView (elementId) {
      window
        .document
        .getElementById(elementId)
        .scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
  }
})
