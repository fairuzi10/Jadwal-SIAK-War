<template>
  <div >
    <h3>Jadwal Tersimpan</h3>
    <hr class="white-border"/>
    <div v-if="isEmptyArray(namaJadwalList)">
      Belum ada jadwal tersimpan
    </div>
    <b-card
      class="mb-3 text-green-dark card-jadwal"
      v-for="namaJadwal in namaJadwalList"
      :key="namaJadwal"
    >
      <div>
        {{namaJadwal}}
        <div id="choose-jadwal">
        <b-button variant="green-light" size="sm">Lihat</b-button>
        <b-button variant="green-dark" size="sm">Ubah</b-button>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import {
  getObjectOrArray,
  NAMA_JADWAL_LIST
} from '@/helper/storage'

export default {
  name: 'jadwal-tersimpan',
  data () {
    return {
      namaJadwalList: null
    }
  },
  methods: {
    updateNamaJadwalList () {
      this.namaJadwalList = getObjectOrArray(NAMA_JADWAL_LIST)
    }
  },
  created () {
    this.updateNamaJadwalList()
  }
}
</script>

<style scoped>
.card-jadwal {
  font-size: 0.9rem;
  font-weight: bold;
}

#choose-jadwal > .btn {
  margin: 0 2px;
}

.white-border {
  border-color: white;
}
</style>
