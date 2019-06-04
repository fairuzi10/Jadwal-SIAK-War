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
$theme-colors: (
  "green-dark": #2c3e50,
  "green-light": #41b883
);
@import "~bootstrap/scss/bootstrap.scss";
@import "~bootstrap-vue/src/index.scss";
</style>
