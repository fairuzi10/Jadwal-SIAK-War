<template>
  <div
    id="buat-jadwal"
  >
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
          v-model="jurusan"
          class="form-control"
        >
          <option
            :value="null"
            selected
          >
            Pilih Jurusanmu
          </option>
          <option
            v-for="opsi_jurusan in list_jurusan"
            :key="opsi_jurusan.value"
            :value="opsi_jurusan.value"
          >
            {{ opsi_jurusan.label }}
          </option>
        </select>
      </div>
      <template v-if="!jurusan">
        <div class="text-center">
          Atau unggah jadwal jurusanmu
        </div>
        <div class="custom-file">
          <input
            id="file-jadwal"
            type="file"
            class="custom-file-input"
            @change="changeFile"
          >
          <label
            class="custom-file-label"
            for="file-jadwal"
          >Unggah Jadwal</label>
        </div>
        <div
          v-if="validHtmlFile === false"
          class="invalid-feedback d-block"
        >
          Pastikan file yang Anda unggah merupakan file HTML.
        </div>
      </template>
    </form>

    <course-list
      v-if="classOpt"
      :class-opt="classOpt"
    />
    <course-placeholder v-else-if="loading" />

    <transition name="fade">
      <button
        v-if="!allValueOfObjectIsNull(chosenClass)"
        id="button-simpan-jadwal"
        @click="showCurrentChosenTable = true"
      >
        Lihat Jadwal Sementara
      </button>
    </transition>

    <!-- <transition name="fade">
      <b-form
        v-if="!allValueOfObjectIsNull(chosenClass)"
        inline
      >
        <b-button
          id="button-simpan-jadwal"
          size="lg"
          pill
          class="px-5"
          @click="simpanJadwal"
        >
          Simpan Jadwal
        </b-button>
        <b-input
          v-model="namaJadwal"
          class="mr-2"
          :placeholder="namaJadwalDefault"
          :state="validNamaJadwal"
          required
        />
      </b-form>
    </transition> -->
    <!-- <div class="text-right">
      <b-form-invalid-feedback
        :state="validNamaJadwal"
      >
        Kamu telah memiliki jadwal dengan nama yang sama.
      </b-form-invalid-feedback>
    </div> -->
    <b-modal
      v-model="showCurrentChosenTable"
      title="Jadwal Sementara"
      header-text-variant="dark"
      header-class="modal-header-yellow"
      ok-only
      ok-variant="yellow"
    >
      <tabel-jadwal :jadwal="chosenClass" />
    </b-modal>
  </div>
</template>

<script>
import CourseList from './CourseList'
import CoursePlaceholder from './CourseList/Placeholder'
import { mapGetters } from 'vuex'
import { INIT_CHOSEN_CLASS } from '@/store'
import TableParser from '@/helper/TableParser'
import { setImmediate } from 'timers'
import {
  getObjectOrArray,
  addArrayElement,
  addObjectProperty,
  JADWAL_LIST,
  NAMA_JADWAL_LIST
} from '@/helper/storage'
import { BModal } from 'bootstrap-vue'
import TabelJadwal from './TabelJadwal'

export default {
  name: 'BuatJadwal',

  components: {
    CourseList,
    CoursePlaceholder,
    BModal,
    TabelJadwal
  },

  props: {
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
      file: null,
      jurusan: null,
      list_jurusan: [
        { label: 'Ilmu Komputer', value: 'ilmu-komputer' },
        { label: 'Sistem Informasi', value: 'sistem-informasi' }
      ],
      reader: this.initReader(),
      validHtmlFile: null,
      namaJadwal: null,
      validNamaJadwal: null,
      loading: false,
      showCurrentChosenTable: false
    }
  },
  computed: {
    ...mapGetters(['chosenClass']),
    namaJadwalDefault: function () {
      const date = new Date()
      return (
        'Jadwal ' + date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
      )
    }
  },
  watch: {
    file: function (newFile, oldFile) {
      if (!newFile || newFile.type !== 'text/html') {
        this.validHtmlFile = false
        this.$emit('set-class-opt', null)
      } else {
        this.validHtmlFile = true
        this.$emit('set-class-opt', null)
        this.reader.readAsText(newFile)
      }
    },
    jurusan: function (newJurusan, oldJurusan) {
      this.$emit('set-class-opt', null)
      if (newJurusan) {
        this.loading = true
        // async function
        // failed to use Promise, probably due to Promise's high priority
        // more on this: https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
        setImmediate(async () => {
          try {
            const dataJurusan = (await import('@/data/' + newJurusan + '.json'))
              .default
            this.$emit('set-class-opt', dataJurusan)
          } catch (e) {
            // TODO: error handling
          }
          this.loading = false
        })
      }
    },
    classOpt: function (newClassOpt, oldClassOpt) {
      if (newClassOpt) {
        this.$store.dispatch(INIT_CHOSEN_CLASS, Object.keys(newClassOpt))
      } else {
        this.$store.dispatch(INIT_CHOSEN_CLASS, [])
      }
    }
  },
  methods: {
    changeFile (event) {
      this.file = event.target.files[0]
    },
    initReader () {
      const reader = new FileReader()
      reader.onload = e => {
        const parser = new DOMParser()
        const htmlDoc = parser.parseFromString(e.target.result, 'text/html')
        const table = htmlDoc.querySelectorAll('table.box')
        this.$emit('set-class-opt', TableParser.parse(table))
      }
      return reader
    },
    simpanJadwal () {
      const nama = this.namaJadwal || this.namaJadwalDefault
      const existingJadwal = getObjectOrArray(JADWAL_LIST)
      if (existingJadwal && nama in existingJadwal) {
        this.validNamaJadwal = false
      } else {
        this.validNamaJadwal = true
        addArrayElement(NAMA_JADWAL_LIST, nama)
        addObjectProperty(JADWAL_LIST, nama, {
          classOpt: this.classOpt,
          chosenClass: this.chosenClass
        })
        this.updateNamaJadwalList()
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

#button-simpan-jadwal {
  position: fixed;
  right: 20px;
  bottom: 20px;
  border: 1px solid $yellow5;
  border-radius: 2rem;
  padding: 0.75rem 2rem;
  outline: 0;
  color: $dark;
  font-weight: bold;
  background-image: $gradient-yellow;
  &:hover {
    background-image: $gradient-yellow-dark;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .15s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
