<template>
  <div>
    <b-navbar
      toggleable="lg"
      variant="light"
    >
      <b-navbar-brand
        href="."
        class="text-decoration-none"
      >
        <div id="navbar-logo">
          Jadwal SIAK
        </div>
      </b-navbar-brand>
    </b-navbar>
    <div class="container-fluid px-0">
      <div class="row no-gutters">
        <div class="col-12 col-md-3 d-flex">
          <jadwal-tersimpan
            ref="jadwalTersimpan"
            :update-jadwal-dilihat="updateJadwalDilihat"
            :show-buat-jadwal="showBuatJadwal"
            :nama-jadwal-list="namaJadwalList"
            :jadwal-dilihat="jadwalDilihat"
          />
        </div>
        <div
          id="top-view"
          class="col-12 col-md-9"
        >
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
              :class-opt="classOpt"
              :update-nama-jadwal-list="updateNamaJadwalList"
              @set-class-opt="classOpt = $event"
            />
          </transition>
        </div>
      </div>
    </div>
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
import {
  BNavbar,
  BNavbarBrand
} from 'bootstrap-vue'

export default {
  name: 'JadwalSiak',
  components: {
    JadwalTersimpan,
    BuatJadwal,
    LihatJadwal,
    BNavbar,
    BNavbarBrand
  },
  data () {
    return {
      jadwalDilihat: null,
      namaJadwalList: null,
      classOpt: null
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
  color: $dark;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .15s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

#navbar-logo {
  background-image: $gradient-yellow;
  padding: 0.25rem 1rem;
  color: $dark;
  font-weight: bold;
  border-radius: 1rem;

  &:hover {
    text-decoration: none;
  }
}

.navbar {
  z-index: 1;
  box-shadow: 0px 10px 20px -10px rgba(0,64,128,0.2);
}
</style>
