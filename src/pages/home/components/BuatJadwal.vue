<template>
  <div id="buat-jadwal">
    <h3 class="text-center">
      Buat Jadwal
    </h3>

    <form id="pilih-jurusan-form">
      <div
        v-if="!file"
        class="form-group"
      >
        <select
          id="pilih-jurusan"
          class="form-control"
          @change="setMajor($event.target.value)"
        >
          <option
            v-for="opsi_jurusan in list_jurusan"
            :key="opsi_jurusan.value"
            :value="opsi_jurusan.value"
            :selected="opsi_jurusan.value === major"
          >
            {{ opsi_jurusan.label }}
          </option>
        </select>
      </div>
      <div
        v-if="!major"
        class=" mb-3"
      >
        <div class="text-center">
          Atau unggah jadwal jurusanmu
        </div>
        <div class="custom-file">
          <input
            id="file-jadwal"
            type="file"
            class="custom-file-input"
            @change="setFile($event.target.files[0])"
          >
          <label
            class="custom-file-label"
            for="file-jadwal"
          >{{ file ? file.name : 'Unggah Jadwal' }}</label>
        </div>
        <div
          v-if="validHtmlFile === false"
          class="invalid-feedback d-block"
        >
          Pastikan file yang Anda unggah merupakan file HTML.
        </div>
      </div>
      <div
        v-if="major || file"
        class="d-flex justify-content-end"
      />
    </form>

    <susun-jadwal />

    <transition name="button-jadwal-sementara">
      <button
        v-if="!allValueOfObjectIsNull(chosenClass)"
        id="button-jadwal-sementara"
        @click="showCurrentChosenTable = true"
      >
        Lihat Jadwal Sementara
      </button>
    </transition>

    <b-modal
      v-model="showCurrentChosenTable"
      title="Jadwal Sementara"
      header-text-variant="dark"
      header-class="modal-header-yellow tabel-jadwal"
      dialog-class="tabel-jadwal"
      hide-footer
    >
      <tabel-jadwal :jadwal="chosenClass" />
      <div class="d-flex justify-content-end mt-2">
        <form class="form-inline">
          <div class="input-group mr-2">
            <b-input
              v-model="namaJadwal"
              class="mr-2"
              :placeholder="namaJadwalDefault"
              :state="validNamaJadwal"
            />
          </div>
          <button
            class="btn btn-yellow"
            @click.prevent="simpanJadwal"
          >
            <b>Simpan</b>
          </button>
        </form>
      </div>
      <b-form-invalid-feedback
        :state="validNamaJadwal"
        class="text-right"
      >
        Kamu telah memiliki jadwal dengan nama yang sama.
      </b-form-invalid-feedback>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getObjectOrArray,
  addArrayElement,
  addObjectProperty,
  setItem,
  getItem,
  JADWAL_LIST,
  NAMA_JADWAL_LIST,
  SUGGESTED_NAMA_JADWAL
} from '@/helper/storage'
import TabelJadwal from './TabelJadwal'
import SusunJadwal from './SusunJadwal'
import { UPLOAD_SCHEDULE_FILE, SELECT_MAJOR } from '@/store/actions.type'

export default {
  name: 'BuatJadwal',

  components: {
    TabelJadwal,
    SusunJadwal
  },

  props: {
    updateJadwalDilihat: {
      type: Function,
      required: true
    },
    updateNamaJadwalList: {
      type: Function,
      required: true
    },
    classOpt: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
      list_jurusan: [
        { label: 'Pilih Jurusanmu', value: null },
        ...[
          { label: 'Ilmu Komputer', value: 'ilmu-komputer' },
          { label: 'Teknik Elektro', value: 'teknik-elektro' },
          { label: 'Farmasi', value: 'farmasi' }
        ].sort((a, b) => a.label.localeCompare(b.label))
      ],
      validHtmlFile: null,
      namaJadwal: null,
      validNamaJadwal: null,
      loading: false,
      showCurrentChosenTable: false
    }
  },
  computed: {
    ...mapGetters({ file: 'createScheduleFile', major: 'createScheduleMajor', chosenClass: 'chosenClass' }),
    namaJadwalDefault () {
      if (this.edittedNamaJadwal) return this.edittedNamaJadwal
      const suggestion = getItem(SUGGESTED_NAMA_JADWAL) || 'Plan A'
      return suggestion
    }
  },
  methods: {
    setFile (file) {
      this.$store.dispatch(UPLOAD_SCHEDULE_FILE, file)
    },
    setMajor (major) {
      this.$store.dispatch(SELECT_MAJOR, major)
    },
    simpanJadwal () {
      const nama = this.namaJadwal || this.namaJadwalDefault
      const existingJadwal = getObjectOrArray(JADWAL_LIST) || {}
      if (nama in existingJadwal) {
        this.validNamaJadwal = false
      } else {
        this.validNamaJadwal = true
        addArrayElement(NAMA_JADWAL_LIST, nama)
        addObjectProperty(JADWAL_LIST, nama, {
          classOpt: this.classOpt,
          chosenClass: this.chosenClass
        })

        const nextNamaJadwalDefault = this.namaJadwalDefault.slice(0, -1) +
          String.fromCharCode(this.namaJadwalDefault.charCodeAt(this.namaJadwalDefault.length - 1) + 1)
        setItem(SUGGESTED_NAMA_JADWAL, nextNamaJadwalDefault)

        this.updateNamaJadwalList()
        this.showCurrentChosenTable = false
        this.reset()
        this.updateJadwalDilihat(nama)
        this.scrollIntoView('top-view')
      }
    }
  }
}
</script>

<style lang="scss" scoped>

#buat-jadwal {
  min-height: $min-window-height;
  padding: 3rem 1rem;
}

#pilih-jurusan-form {
  border: 1px solid $border-color;
  border-radius: $border-radius;
  padding: 1rem 2rem;
  margin-bottom: 2rem;
}

.form-group {
  &:last-child {
    margin-bottom: 0;
  }
}

#button-jadwal-sementara {
  position: fixed;
  right: 30px;
  bottom: 30px;
  border: 1px solid $yellow5;
  border-radius: 2rem;
  padding: 0.75rem 2rem;
  outline: 0;
  color: $dark;
  font-weight: bold;
  background-color: $yellow3;
  background-image: $gradient-yellow;

  &:hover {
    background-image: $gradient-yellow-dark;
  }
}

.button-jadwal-sementara-enter-active {
  animation: button-jadwal-sementara .5s;
}
.button-jadwal-sementara-leave-active {
  animation: button-jadwal-sementara .5s reverse;
}

@keyframes button-jadwal-sementara {
  from {
    bottom: 0px;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

</style>
