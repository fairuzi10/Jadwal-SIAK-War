<template>
  <jadwal-siak></jadwal-siak>
</template>

<script>
import './bootstrap'
import JadwalSiak from '@/components/JadwalSiak'

export default {
  name: 'app',
  components: {
    JadwalSiak
  }
}
</script>

<style>
@import '~bootstrap-vue/dist/bootstrap-vue.min.css';
@import '~bootstrap/dist/css/bootstrap.min.css';
</style>
