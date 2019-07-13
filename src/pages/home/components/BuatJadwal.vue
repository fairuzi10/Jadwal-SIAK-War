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
          class="form-control"
          @change="$emit('set-jurusan', $event.target.value)"
        >
          <option
            v-for="opsi_jurusan in list_jurusan"
            :key="opsi_jurusan.value"
            :value="opsi_jurusan.value"
            :selected="opsi_jurusan.value === jurusan"
          >
            {{ opsi_jurusan.label }}
          </option>
        </select>
      </div>
      <div
        v-if="!jurusan"
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
            @change="changeFile"
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
        v-if="jurusan || file"
        class="d-flex justify-content-end"
      />
    </form>

    <template
      v-if="classFiltered"
    >
      <div
        class="filter-box"
      >
        <h5>Filter</h5>
        <input
          :value="filter"
          class="form-control mb-2"
          type="text"
          aria-describedby="filter-class"
          placeholder="Filter nama kelas/dosen"
          @input="$emit('set-filter', $event.target.value)"
        >
        <div class="form-group form-check">
          <input
            id="filter-selected"
            :checked="filterSelected"
            type="checkbox"
            class="form-check-input"
            @input="$emit('set-filter-selected', $event.target.checked)"
          >
          <label
            class="form-check-label"
            for="filter-selected"
          >Kelas terpilih</label>
        </div>
      </div>

      <div class="text-right">
        <button
          class="btn btn-red"
          @click.prevent="reset"
        >
          Reset
        </button>
      </div>

      <course-list
        :class-filtered="classFiltered"
      />
    </template>
    <course-placeholder v-else-if="loading" />

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
import TabelJadwal from './TabelJadwal'

export default {
  name: 'BuatJadwal',

  components: {
    CourseList,
    CoursePlaceholder,
    TabelJadwal
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
    },
    file: {
      type: Object,
      default: null
    },
    jurusan: {
      type: String,
      default: null
    },
    filter: {
      type: String,
      default: null
    },
    filterSelected: {
      type: Boolean,
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
    namaJadwalDefault () {
      const namaJadwalList = getObjectOrArray(NAMA_JADWAL_LIST) || []
      const numOfJadwal = namaJadwalList.length
      return (
        'Plan ' + String.fromCharCode(65 + numOfJadwal)
      )
    },
    classFiltered () {
      if (!this.classOpt) return null
      let classFiltered = { ...this.classOpt }
      if (this.filter) {
        const upperCasedFilter = this.filter.toUpperCase()
        const filteredClassName = Object.keys(classFiltered).filter(className =>
          this.matchClassName(className, upperCasedFilter) ||
          this.matchClassInsName(className, upperCasedFilter) ||
          this.matchLecturerName(className, upperCasedFilter)
        )
        classFiltered = filteredClassName.reduce((acc, className) => ({
          ...acc, [className]: classFiltered[className]
        }), {})
      }
      if (this.filterSelected) {
        classFiltered = Object.keys(classFiltered).reduce((acc, className) => (
          this.chosenClass[className]
            ? { ...acc, [className]: classFiltered[className] }
            : acc
        ), {})
      }
      return classFiltered
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
      this.$emit('set-filter', null)
      this.$emit('set-filter-selected', false)
    }
  },
  methods: {
    reset () {
      this.$store.dispatch(INIT_CHOSEN_CLASS, [])
      this.$emit('set-filter', null)
      this.$emit('set-filter-selected', null)
    },
    changeFile (event) {
      this.$emit('set-file', event.target.files[0])
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
        this.updateNamaJadwalList()
        this.showCurrentChosenTable = false
        this.reset()
        this.updateJadwalDilihat(nama)
        this.scrollIntoView('top-view')
      }
    },
    matchClassName (className, upperCasedFilter) {
      const cleanClassName = className.replace('-', ' ').toUpperCase()
      return cleanClassName.includes(upperCasedFilter)
    },
    matchClassInsName (className, upperCasedFilter) {
      if (this.classOpt[className].options.length === 0) return false
      const classInsName = this.classOpt[className].options[0]['NAMA KELAS']
      const cleanClassInsName = classInsName.replace('-', '').toUpperCase()
      return cleanClassInsName.includes(upperCasedFilter)
    },
    matchLecturerName (className, upperCasedFilter) {
      const lecturersName = this.classOpt[className].options
        .map(classIns => (classIns['PENGAJAR'] || []).join(', '))
        .join(', ')
      const cleanLecturersName = lecturersName.toUpperCase()
      return cleanLecturersName.includes(upperCasedFilter)
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

.filter-box {
  background-color: $grey0;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  padding: 1rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0px 10px 20px -10px rgba(0,64,128,0.2);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .15s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
