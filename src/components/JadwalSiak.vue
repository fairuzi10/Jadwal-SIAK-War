<template>
  <div>
    <b-navbar toggleable="lg" type="dark" class="bg-green-dark">
      <b-navbar-brand href>Jadwal SIAK</b-navbar-brand>
    </b-navbar>
    <b-container fluid>
      <b-row>
        <b-col
          id="jadwal-tersimpan"
          cols="12"
          md="3"
          class="bg-green-light text-white"
        >
          <jadwal-tersimpan ref="jadwalTersimpan"/>
        </b-col>
        <b-col id="buat-jadwal" cols="12" md="9">
          <buat-jadwal />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import JadwalTersimpan from '@/components/JadwalTersimpan'
import BuatJadwal from '@/components/BuatJadwal'

export default {
  name: 'JadwalSiak',
  components: {
    JadwalTersimpan,
    BuatJadwal
  }
}
</script>

<style scoped>
body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
