<template>
  <div id="jadwal-tersimpan">
    <h3>Jadwal Tersimpan</h3>
    <hr class="white-border"/>
    <div v-if="isEmptyArray(namaJadwalList)">
      Belum ada jadwal tersimpan
    </div>
    <b-card
      class="mb-3 text-green-dark card-jadwal"
      :class="{ selected: jadwalDilihat === namaJadwal }"
      v-for="namaJadwal in namaJadwalList"
      :key="namaJadwal"
    >
      <div>
        {{namaJadwal}}
        <div id="choose-jadwal">
        <b-button variant="green-light" size="sm"
          @click="select(namaJadwal)"
        >Lihat</b-button>
        <b-button variant="green-dark" size="sm">Ubah</b-button>
        </div>
      </div>
    </b-card>
    <b-button variant="green-dark" block
      @click="showBuatJadwal"
    >Buat Jadwal Baru</b-button>
  </div>
</template>

<script>
export default {
  name: 'jadwal-tersimpan',
  props: [
    'updateJadwalDilihat',
    'showBuatJadwal',
    'namaJadwalList',
    'updateNamaJadwaList',
    'jadwalDilihat'
  ],
  methods: {
    select (namaJadwal) {
      this.updateJadwalDilihat(namaJadwal)
      this.scrollToTop()
    }
  }
}
</script>

<style lang="scss" scoped>
#jadwal-tersimpan {
  padding: 2rem;
  text-align: center;
}

.card-jadwal {
  font-size: 0.9rem;
  font-weight: bold;
}

#choose-jadwal > .btn {
  margin: 2px;
}

.white-border {
  border-color: white;
}

.selected {
  background-color: $white-selected;
}
</style>
