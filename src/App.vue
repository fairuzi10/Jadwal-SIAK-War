<template>
  <jadwal-siak/>
</template>

<script>
import './bootstrap'
import './store'
import JadwalSiak from '@/components/JadwalSiak'

export default {
  name: 'App',
  components: {
    JadwalSiak
  }
}
</script>

<style lang="scss">
@import '@/styles/variables.scss';

$theme-colors: (
  "green-dark": $green-dark,
  "green-light": $green-light
);
@import "~bootstrap/scss/bootstrap.scss";
@import "~bootstrap-vue/src/index.scss";
</style>
