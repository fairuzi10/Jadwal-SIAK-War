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
        class="btn btn-outline-grey mr-2"
        @click="ubahJadwal"
      >
        Ubah
      </button>
      <button
        class="btn btn-red"
        @click="showDeleteModal = true"
      >
        Hapus
      </button>
    </div>
    <b-modal
      id="delete-jadwal-modal"
      v-model="showDeleteModal"
      title="Hapus Jadwal"
      header-text-variant="light"
      header-class="modal-header-red"
      cancel-variant="outline-grey"
      cancel-title="Batal"
      ok-variant="red"
      ok-title="Hapus"
      @ok="hapusJadwal"
    >
      Yakin ingin menghapus jadwal ini?
    </b-modal>
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
  data () {
    return {
      showDeleteModal: false
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
    },
    ubahJadwal () {

    }
  }
}
</script>

<style lang="scss" scoped>
#lihat-jadwal {
  min-height: $min-window-height;
  padding: 3rem 0.25rem;

  @include sm {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>
