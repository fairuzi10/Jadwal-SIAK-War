<template>
  <div id="jadwal-tersimpan">
    <div class="bg-gradient-yellow p-1 mt-5">
      <h3>Jadwal Tersimpan</h3>
    </div>
    <div v-if="isEmptyArray(namaJadwalList)">
      Belum ada jadwal tersimpan
    </div>
    <div class="px-4 py-3">
      <b-card
        v-for="namaJadwal in namaJadwalList"
        :key="namaJadwal"
        class="mb-3 text-green-dark card-jadwal"
        :class="{ selected: jadwalDilihat === namaJadwal }"
      >
        <div>
          {{ namaJadwal }}
          <div id="choose-jadwal">
            <button
              class="mt-2 bg-gradient-yellow"
              @click="() => select(namaJadwal)"
            >
              Lihat
            </button>
          </div>
        </div>
      </b-card>
      <button
        class="bg-gradient-yellow"
        @click="showBuatJadwal"
      >
        Buat Jadwal Baru
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JadwalTersimpan',
  props: [
    'updateJadwalDilihat',
    'showBuatJadwal',
    'namaJadwalList',
    'updateNamaJadwaList',
    'jadwalDilihat',
    'topView'
  ],
  methods: {
    select: function (namaJadwal) {
      this.updateJadwalDilihat(namaJadwal)
      window.document.getElementById('top-view').scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
  }
}
</script>

<style lang="scss" scoped>
#jadwal-tersimpan {
  text-align: center;
  @include bg-gradient-navy-blue;
  flex: 1;
}

button {
  border: 1px solid $green-dark;
  padding: 0.375rem 0.75rem;
  border-radius: 50rem !important;
  display: block;
  width: 100%;
  &:hover {
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, opacity 0.15s ease-in-out;
    opacity: 0.8;
  }
  &:focus {
    outline: 0;
  }
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
  transition: background-color 0.15s ease-in-out;
}
</style>
