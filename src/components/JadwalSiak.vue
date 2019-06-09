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
          <jadwal-tersimpan ref="jadwalTersimpan"
            :updateJadwalDilihat="updateJadwalDilihat"
          />
        </b-col>
        <b-col id="buat-jadwal" cols="12" md="9">
          <lihat-jadwal v-if="jadwalDilihat" :namaJadwal="jadwalDilihat"/>
          <buat-jadwal v-else />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import JadwalTersimpan from '@/components/JadwalTersimpan'
import BuatJadwal from '@/components/BuatJadwal'
import LihatJadwal from '@/components/LihatJadwal'

export default {
  name: 'JadwalSiak',
  data () {
    return {
      jadwalDilihat: null
    }
  },
  methods: {
    updateJadwalDilihat (namaJadwal) {
      this.jadwalDilihat = namaJadwal
    }
  },
  components: {
    JadwalTersimpan,
    BuatJadwal,
    LihatJadwal
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
