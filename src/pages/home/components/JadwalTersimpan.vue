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
            <b-button
              class="yellow-block-button"
              @click="select(namaJadwal)"
            >
              Lihat
            </b-button>
          </div>
        </div>
      </b-card>
      <b-button
        class="yellow-block-button"
        @click="showBuatJadwal"
      >
        Buat Jadwal Baru
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JadwalTersimpan',
  props: {
    updateJadwalDilihat: {
      type: Function,
      required: true
    },
    showBuatJadwal: {
      type: Function,
      required: true
    },
    namaJadwalList: {
      type: Array,
      required: true
    },
    jadwalDilihat: {
      type: String,
      default: null
    }
  },
  methods: {
    select: function (namaJadwal) {
      this.updateJadwalDilihat(namaJadwal)
      this.scrollIntoView('lihat-jadwal')
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

.yellow-block-button {
  @include bg-gradient-yellow;
  display: block;
  width: 100%;
  border-radius: 1.25rem;
  &:hover {
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, opacity 0.15s ease-in-out;
    opacity: 0.8;
  }
  &:active:not(:disabled):not(.disabled) {
    color: $green-dark;
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
