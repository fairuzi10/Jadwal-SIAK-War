<template>
  <div>
    <b-navbar toggleable="lg" type="dark" class="bg-green-dark">
      <b-navbar-brand href=".">Jadwal SIAK</b-navbar-brand>
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
            :showBuatJadwal="showBuatJadwal"
            :namaJadwalList="namaJadwalList"
            :jadwalDilihat="jadwalDilihat"
          />
        </b-col>
        <b-col :class="{ 'lihat-jadwal-wrapper': jadwalDilihat }" cols="12" md="9" >
          <keep-alive>
            <lihat-jadwal :namaJadwal="jadwalDilihat" v-if="jadwalDilihat" />
            <buat-jadwal :updateNamaJadwalList="updateNamaJadwalList" v-else />
          </keep-alive>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import JadwalTersimpan from '@/components/JadwalTersimpan'
import BuatJadwal from '@/components/BuatJadwal'
import LihatJadwal from '@/components/LihatJadwal'
import {
  getObjectOrArray,
  NAMA_JADWAL_LIST,
  getItem,
  setItem,
  LAST_SEEN_JADWAL
} from '@/helper/storage'

export default {
  name: 'JadwalSiak',
  data () {
    return {
      jadwalDilihat: null,
      namaJadwalList: null
    }
  },
  created () {
    this.updateNamaJadwalList()
    this.getLastSeenJadwal()
  },
  methods: {
    updateJadwalDilihat (namaJadwal) {
      setItem(LAST_SEEN_JADWAL, namaJadwal)
      this.jadwalDilihat = namaJadwal
    },
    showBuatJadwal () {
      this.updateJadwalDilihat(null)
      this.scrollToTop()
    },
    updateNamaJadwalList () {
      this.namaJadwalList = getObjectOrArray(NAMA_JADWAL_LIST)
    },
    getLastSeenJadwal () {
      this.jadwalDilihat = getItem(LAST_SEEN_JADWAL)
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
.lihat-jadwal-wrapper {
  /* special case, for mobile view */
  padding: 0;
}
</style>
