<template>
  <div>
    <b-navbar toggleable="lg" type="dark" class="bg-green-dark">
      <b-navbar-brand href="">Jadwal SIAK</b-navbar-brand>
    </b-navbar>
    <b-container fluid>
      <b-row>
        <b-col id="jadwal-tersimpan" cols="12" md="3"
          order="2" order-md="1" class="bg-green-light text-white"
        >
          <h3>Jadwal Tersimpan</h3>
        </b-col>
        <b-col id="buat-jadwal" cols="12" md="9" order="1" order-md="2">
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
              <b-form-invalid-feedback :state="validHtmlFile">
                Pastikan file yang Anda unggah merupakan file HTML.
              </b-form-invalid-feedback>
            </template>
          </b-card>
          <course-list :classOpt="classOpt" v-if="classOpt" />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import TableParser from '@/helper/TableParser'
import CoursePlaceholder from '@/components/CoursePlaceholder'
import { INIT_CHOSEN_CLASS } from '@/store'
import { setImmediate } from 'timers'

export default {
  name: 'JadwalSiak',
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
      classOpt: null
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
    }
  },
  watch: {
    file: function (newFile, oldFile) {
      if (!newFile || newFile.type !== 'text/html') {
        this.validHtmlFile = false
      } else {
        this.validHtmlFile = true
        this.reader.readAsText(newFile)
      }
    },
    jurusan: function (newJurusan, oldJurusan) {
      if (newJurusan) {
        this.classOpt = null
        // async function
        // failed to use Promise, probably due to Promise's high priority
        // more on this: https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
        setImmediate(async () => {
          const dataJurusan = (await import('@/data/' + newJurusan + '.json')).default
          this.classOpt = dataJurusan
        })
      }
    },
    classOpt: function (newClassOpt, oldClassOpt) {
      this.$store.dispatch(INIT_CHOSEN_CLASS, Object.keys(newClassOpt))
    }
  },
  components: {
    CourseList: () => ({
      component: import('@/components/CourseList'),
      loading: CoursePlaceholder,
      delay: 0
    })
  }
}
</script>

<style scoped>
#jadwal-tersimpan {
  min-height: 700px;
  padding: 2rem;
  text-align: center;
}

#buat-jadwal {
  min-height: 700px;
  padding: 2rem;
  text-align: center;
}

body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
