<template>
  <div id="lihat-jadwal">
    <h4>{{ namaJadwal }}</h4>
    <tabel-jadwal :jadwal="jadwal.chosenClass" />
  </div>
</template>

<script>
import {
  getObjectOrArray,
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
    }
  },
  computed: {
    jadwal () {
      return getObjectOrArray(JADWAL_LIST)[this.namaJadwal]
    }
  }
}
</script>

<style>
#lihat-jadwal {
  min-height: $min-window-height;
  padding: 3rem 0.25rem;
  text-align: center;

  @include sm {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>
