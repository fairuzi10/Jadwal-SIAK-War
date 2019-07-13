<template>
  <div id="lihat-jadwal">
    <h4 class="text-center">
      {{ namaJadwal }}
    </h4>
    <tabel-jadwal
      :jadwal="jadwal.chosenClass"
      class="mb-3"
    />
    <div class="text-right">
      <button
        class="btn btn-red"
        @click="hapusJadwal"
      >
        Hapus
      </button>
    </div>
  </div>
</template>

<script>
import {
  getObjectOrArray,
  removeObjectProperty,
  removeArrayElement,
  NAMA_JADWAL_LIST,
  JADWAL_LIST
} from '@/helper/storage'
import TabelJadwal from './TabelJadwal'

export default {
  name: 'LihatJadwal',
  components: {
    TabelJadwal
  },
  props: {
    namaJadwal: {
      type: String,
      default: null
    },
    showBuatJadwal: {
      type: Function,
      required: true
    },
    updateNamaJadwalList: {
      type: Function,
      required: true
    }
  },
  computed: {
    jadwal () {
      return getObjectOrArray(JADWAL_LIST)[this.namaJadwal]
    }
  },
  methods: {
    hapusJadwal () {
      removeObjectProperty(JADWAL_LIST, this.namaJadwal)
      removeArrayElement(NAMA_JADWAL_LIST, this.namaJadwal)
      this.updateNamaJadwalList()
      this.showBuatJadwal()
    }
  }
}
</script>

<style>
#lihat-jadwal {
  min-height: $min-window-height;
  padding: 3rem 0.25rem;

  @include sm {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>
