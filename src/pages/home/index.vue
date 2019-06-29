<template>
  <div>
    <b-navbar
      toggleable="lg"
      class="bg-gradient-yellow"
    >
      <b-navbar-brand href=".">
        Jadwal SIAK
      </b-navbar-brand>
    </b-navbar>
    <b-container
      fluid
      class="px-0"
    >
      <b-row no-gutters>
        <b-col
          cols="12"
          md="3"
          class="d-flex"
        >
          <jadwal-tersimpan
            ref="jadwalTersimpan"
            :update-jadwal-dilihat="updateJadwalDilihat"
            :show-buat-jadwal="showBuatJadwal"
            :nama-jadwal-list="namaJadwalList"
            :jadwal-dilihat="jadwalDilihat"
          />
        </b-col>
        <b-col
          id="top-view"
          cols="12"
          md="9"
        >
          <keep-alive>
            <transition
              name="fade"
              mode="out-in"
            >
              <lihat-jadwal
                v-if="jadwalDilihat"
                :key="jadwalDilihat"
                :nama-jadwal="jadwalDilihat"
              />
              <buat-jadwal
                v-else
                key="buat-jadwal"
                :update-nama-jadwal-list="updateNamaJadwalList"
              />
            </transition>
          </keep-alive>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import JadwalTersimpan from './components/JadwalTersimpan'
import BuatJadwal from './components/BuatJadwal'
import LihatJadwal from './components/LihatJadwal'
import {
  getObjectOrArray,
  NAMA_JADWAL_LIST,
  getItem,
  setItem,
  LAST_SEEN_JADWAL
} from '@/helper/storage'

export default {
  name: 'JadwalSiak',
  components: {
    JadwalTersimpan,
    BuatJadwal,
    LihatJadwal
  },
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
      window.document.getElementById('top-view').scrollIntoView({ block: 'start', behavior: 'smooth' })
    },
    updateNamaJadwalList () {
      this.namaJadwalList = getObjectOrArray(NAMA_JADWAL_LIST)
    },
    getLastSeenJadwal () {
      this.jadwalDilihat = getItem(LAST_SEEN_JADWAL)
    }
  }
}
</script>

<style lang="scss" scoped>
body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $green-dark;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .15s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
