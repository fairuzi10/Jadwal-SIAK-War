<template>
  <jadwal-siak/>
</template>

<script>
import './bootstrap'
import './mixin'
import store from './store'
import JadwalSiak from '@/components/JadwalSiak'

export default {
  store,
  name: 'App',
  components: {
    JadwalSiak
  }
}
</script>

<style lang="scss">
$theme-colors: (
  "green-dark": $green-dark,
  "green-light": $green-light,
  "green-light-faded": $green-light-faded
);

// placed in the bottom to support overriding variables
@import "~bootstrap/scss/bootstrap.scss";
@import "~bootstrap-vue/src/index.scss";
</style>
