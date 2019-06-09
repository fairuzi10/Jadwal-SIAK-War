<template>
  <div id="buat-jadwal">
    <h3>Buat Jadwal</h3>
    <b-card title="Cari Pilihan Jadwalmu" tag="article" class="mb-2">
      <b-form v-if="!file">
        <b-form-group>
          <b-form-select
            id="input-jurusan"
            v-model="jurusan"
            :options="list_jurusan"
            required
          />
        </b-form-group>
      </b-form>

      <template v-if="!jurusan">
        <b-card-text v-if="!file">
          Atau unggah jadwal jurusanmu
          <b-button id="help-upload" href="#" size="sm" variant="info" class="bg-green-dark">?</b-button>
          <b-tooltip ref="tooltip" target="help-upload" placement="bottom">
            Unggah file HTML dari SIAK-mu. Klik untuk info lebih
            lanjut
          </b-tooltip>
        </b-card-text>

        <b-form-file
          v-model="file"
          :state="validHtmlFile"
          placeholder="Unggah jadwal"
          drop-placeholder="Letakkan di sini"
        />
        <b-form-invalid-feedback
          :state="validHtmlFile"
        >Pastikan file yang Anda unggah merupakan file HTML.</b-form-invalid-feedback>
      </template>
    </b-card>
    <course-list v-if="classOpt" :classOpt="classOpt"/>
    <course-placeholder v-else/>
    <b-form inline v-if="!isEmptyObject(classOpt)">
      <b-button variant="green-dark" @click="simpanJadwal">Simpan</b-button>
      <b-input
        class="mr-2"
        :placeholder="namaJadwalDefault"
        v-model="namaJadwal"
        :state="validNamaJadwal"
        required
      />
    </b-form>
    <div class="text-right">
      <b-form-invalid-feedback
        :state="validNamaJadwal"
      >Kamu telah memiliki jadwal dengan nama yang sama.</b-form-invalid-feedback>
    </div>
  </div>
</template>

<script>
import CourseList from '@/components/CourseList'
import CoursePlaceholder from '@/components/CoursePlaceholder'
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

export default {
  name: 'buat-jadwal',
  props: ['updateNamaJadwalList'],
  data () {
    return {
      file: null,
      jurusan: null,
      list_jurusan: [
        { text: 'Pilih Jurusanmu', value: null },
        { text: 'Ilmu Komputer', value: 'ilmu-komputer' },
        { text: 'Sistem Informasi', value: 'sistem-informasi' }
      ],
      reader: this.initReader(),
      validHtmlFile: null,
      classOpt: {},
      namaJadwal: null,
      validNamaJadwal: null
    }
  },
  methods: {
    initReader () {
      const reader = new FileReader()
      reader.onload = e => {
        const parser = new DOMParser()
        const htmlDoc = parser.parseFromString(e.target.result, 'text/html')
        const table = htmlDoc.querySelectorAll('table.box')
        this.classOpt = TableParser.parse(table)
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
  },
  watch: {
    file: function (newFile, oldFile) {
      if (!newFile || newFile.type !== 'text/html') {
        this.validHtmlFile = false
      } else {
        this.validHtmlFile = true
        this.classOpt = null
        this.reader.readAsText(newFile)
      }
    },
    jurusan: function (newJurusan, oldJurusan) {
      if (newJurusan) {
        this.classOpt = null
        this.loading = true
        // async function
        // failed to use Promise, probably due to Promise's high priority
        // more on this: https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
        setImmediate(async () => {
          const dataJurusan = (await import('@/data/' + newJurusan + '.json'))
            .default
          this.classOpt = dataJurusan
          this.loading = false
        })
      }
    },
    classOpt: function (newClassOpt, oldClassOpt) {
      if (newClassOpt) {
        this.$store.dispatch(INIT_CHOSEN_CLASS, Object.keys(newClassOpt))
      }
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
  components: {
    CourseList,
    CoursePlaceholder
  }
}
</script>

<style lang="scss" scoped>
#buat-jadwal {
  min-height: $min-window-height;
  padding: 2rem 0;
  text-align: center;
}

form {
  flex-flow: row-reverse;
}
</style>
