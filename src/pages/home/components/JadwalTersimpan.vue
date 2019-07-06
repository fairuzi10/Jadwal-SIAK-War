<template>
  <div id="jadwal-tersimpan">
    <div class="bg-gradient-yellow p-1 mt-5">
      <h4>Jadwal Tersimpan</h4>
    </div>
    <div v-if="isEmptyArray(namaJadwalList)">
      Belum ada jadwal tersimpan
    </div>
    <div class="px-4 py-3">
      <div
        v-for="namaJadwal in namaJadwalList"
        :key="namaJadwal"
        class="mb-3 card-jadwal"
        :class="{ selected: jadwalDilihat === namaJadwal }"
      >
        <div>
          {{ namaJadwal }}
          <div id="choose-jadwal">
            <button
              class="yellow-block-button"
              @click="select(namaJadwal)"
            >
              Lihat
            </button>
          </div>
        </div>
      </div>
      <hr>
      <button
        class="yellow-block-button my-4 py-2"
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
  background-color: $grey0;
  flex: 1;
}

.yellow-block-button {
  color: $dark;
  background-image: $gradient-yellow;
  display: block;
  width: 100%;
  font-weight: bold;
  border-radius: $border-radius;
  outline: 0;
  border: 1px solid $yellow5;
  padding: 0.25rem 1rem;

  &:hover {
    transition: all 0.15s ease-in-out;
    background-image: $gradient-yellow-dark;
  }

  &:focus {
    outline: 0;
  }
}

.card-jadwal {
  font-size: 0.9rem;
  font-weight: bold;
  padding: 16px;
  color: $dark;
  background-color: $white;
  border-radius: $border-radius;
  border: 1px solid rgba(0,0,0,.125);
  box-shadow: 0px 10px 40px -10px rgba(0,64,128,0.2);
}

#choose-jadwal > .btn {
  margin: 2px;
}

.white-border {
  border-color: white;
}

.selected {
  transition: all 0.15s ease-in-out;
  background-color: $yellow1;
}
</style>
