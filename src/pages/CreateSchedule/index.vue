<template>
  <div id="create-schedule">
    <h3 class="text-center">
      Buat Jadwal
    </h3>

    <form id="choose-major-form">
      <div
        v-if="!file"
        class="form-group"
      >
        <select
          id="choose-major"
          class="form-control mb-2"
          @change="setMajor($event.target.value)"
        >
          <option
            v-for="majorOption in majorList"
            :key="majorOption.value"
            :value="majorOption.value"
            :selected="majorOption.value === major"
          >
            {{ majorOption.label }}
          </option>
        </select>
        <div
          v-if="major"
          class="ml-2 contributor"
        >
          <b>Kontributor: </b>{{ submitterName }}
        </div>
      </div>
      <div
        v-if="!major"
        class=" mb-3"
      >
        <div class="text-center">
          Atau unggah jadwal jurusanmu
          <button
            id="button-help-file"
            class="btn btn-sm btn-yellow"
            @click.prevent="showHelpFile"
          >
            ?
          </button>
        </div>
        <div class="custom-file">
          <input
            id="schedule-file"
            type="file"
            class="custom-file-input"
            @change="setFile($event.target.files[0])"
          >
          <label
            class="custom-file-label"
            for="schedule-file"
          >{{ file ? file.name : 'Unggah Jadwal' }}</label>
        </div>
        <div
          v-if="isValidFile === false"
          class="invalid-feedback d-block"
        >
          Pastikan file yang Anda unggah merupakan file HTML.
        </div>
      </div>
    </form>

    <arrange-schedule />

    <transition name="button-current-schedule">
      <button
        v-if="!allValueOfObjectIsNull(chosenClass)"
        id="button-current-schedule"
        @click="showCurrentChosenTable"
      >
        Lihat Jadwal Sementara
      </button>
    </transition>

    <b-modal
      v-model="isShowingHelpFile"
      title="Bantuan Unggah Jadwal"
      header-text-variant="dark"
      header-class="modal-header-yellow"
      ok-variant="yellow"
      ok-only
    >
      <ol class="pr-4 mb-4">
        <li>Buka laman <a href="https://academic.ui.ac.id/main/Schedule/Index">jadwal kuliah</a> di SIAK</li>
        <li>
          Klik kanan, lalu klik save as <b>(Ctrl+S)</b> dan simpan di folder yang kamu inginkan
          <img
            src="./save-schedule-page.png"
            alt="Simpan file HTML jadwal dari SIAK"
            class="img-fluid py-1"
          >
        </li>
        <li>
          Kembali ke halaman "Buat Jadwal" situs ini dan unggah file HTML tersebut
        </li>
        <li>Susun jadwalmu!</li>
      </ol>

      <h3 class="text-center">
        FAQ
      </h3>
      <div class="accordion">
        <div
          v-for="(faq, idx) in fileFaq"
          :key="faq.question"
          class="card"
        >
          <div
            class="card-header collapsible-header"
            @click="openFaqCollapsibleOfIdx(idx)"
          >
            {{ faq.question }}
          </div>

          <b-collapse
            :id="`accordion-${idx}`"
            accordion="my-accordion"
            role="tabpanel"
          >
            <div class="card-body">
              {{ faq.answer }}
            </div>
          </b-collapse>
        </div>
      </div>
    </b-modal>

    <b-modal
      v-model="isShowingCurrentChosenTable"
      title="Jadwal Sementara"
      header-text-variant="dark"
      header-class="modal-header-yellow schedule-table"
      dialog-class="schedule-table"
      hide-footer
    >
      <schedule-table :chosen-class="chosenClass" />
      <div class="mt-3">
        <form class="form-inline justify-content-end">
          <b-input
            id="typed-schedule-name"
            class="mr-sm-2 form-control-sm"
            :placeholder="suggestedScheduleName"
            :state="isValidTypedScheduleName"
            @change="setTypedScheduleName"
          />
          <button
            class="btn btn-yellow btn-sm my-2"
            @click.prevent="saveSchedule"
          >
            <b>Simpan</b>
          </button>
        </form>
      </div>
      <b-form-invalid-feedback
        :state="isValidTypedScheduleName"
        class="text-right"
      >
        Kamu telah memiliki jadwal dengan nama yang sama.
      </b-form-invalid-feedback>
    </b-modal>

    <b-modal
      v-model="isShowingSelectAnonymousUpload"
      title="Tampilkan Sebagai Kontributor?"
      header-text-variant="dark"
      header-class="modal-header-yellow"
      ok-variant="yellow"
      ok-title="Tampilkan"
      cancel-variant="outline-grey"
      cancel-title="Tidak"
      @hide="uploadFileToBackend($event.trigger !== 'ok')"
    >
      <p>File kamu akan digunakan untuk membantu teman-teman jurusanmu yang lain.</p>

      <p>Ingin ditampilkan sebagai kontributor?</p>
      <b>Pratinjau:</b>
      <div>
        <select
          class="form-control mb-2"
        >
          <option selected>
            {{ fileMajor }}
          </option>
        </select>
        <div class="ml-3 contributor">
          <b>Kontributor: </b>{{ fileSubmitterName }}
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ScheduleTable from '@/components/ScheduleTable'
import ArrangeSchedule from '@/components/ArrangeSchedule'
import {
  CREATE_SCHEDULE__UPLOAD_FILE,
  CREATE_SCHEDULE__SELECT_MAJOR,
  CREATE_SCHEDULE__SAVE_SCHEDULE,
  CREATE_SCHEDULE__LOAD_TYPED_SCHEDULE_NAME,
  CREATE_SCHEDULE__INIT,
  CREATE_SCHEDULE__UPLOAD_FILE_TO_BACKEND
} from '@/store/actions.type'
import { FILE, MAJOR, SCHEDULE } from '@/analytics.type'
import { BCollapse } from 'bootstrap-vue'
import majorOptions from '@/data/major-options.json'

export default {
  name: 'CreateSchedule',
  metaInfo: {
    title: 'Buat Jadwal',
    meta: [
      { name: 'description', content: 'Buat jadwal SIAK war-mu dan menangkan SIAK war!' }
    ]
  },
  components: {
    ScheduleTable,
    ArrangeSchedule,
    BCollapse
  },
  data () {
    return {
      majorList: [
        { label: 'Pilih Jurusanmu', value: null },
        ...majorOptions.sort((a, b) => a.label.localeCompare(b.label))
      ],
      fileFaq: [
        {
          question: 'Apakah mengunggah file jadwal berbahaya bagi akun SSO saya?',
          answer: 'Tidak! Jika kamu membuka file tersebut dengan teks editor seperti Notepad, kamu dapat melihat bahwa ' +
          'data pribadi yang terdapat pada file tersebut hanyalah namamu. Kamu bahkan dapat menghapusnya jika diinginkan.'
        }
      ],
      isShowingCurrentChosenTable: false,
      isShowingHelpFile: false,
      isShowingSelectAnonymousUpload: false
    }
  },
  computed: {
    ...mapState({
      file: state => state.createSchedule.file,
      major: state => state.createSchedule.major,
      isValidFile: state => state.createSchedule.isValidFile,
      suggestedScheduleName: state => state.createSchedule.suggestedScheduleName,
      isValidTypedScheduleName: state => state.createSchedule.isValidTypedScheduleName,
      submitterName: state => state.createSchedule.submitterName,
      computedFile: state => state.createSchedule.computedFile,
      chosenClass: state => state.arrangeSchedule.chosenClass
    }),
    personalData () {
      try {
        let result = this.computedFile.dom.querySelector('.linfo > strong').textContent
          .trim()
          .split('\n')
          .map(str => str.trim())
        if (result.length === 2) {
          result = ['anonim', ...result]
        }
        return result
      } catch (err) {
        return []
      }
    },
    fileSubmitterName () {
      return this.personalData[0] || 'anonim'
    },
    fileMajor () {
      return (this.personalData[2] || '').replace(/ \(.*\)/g, '')
    }
  },
  async mounted () {
    await this.$store.dispatch(CREATE_SCHEDULE__INIT)
  },
  methods: {
    async setFile (file) {
      this.$ga.event(String(FILE), FILE.UPLOAD, this.$route.name)
      await this.$store.dispatch(CREATE_SCHEDULE__UPLOAD_FILE, file)
      if (this.fileSubmitterName === 'anonim') {
        this.uploadFileToBackend(true)
      } else {
        this.isShowingSelectAnonymousUpload = true
      }
    },
    async setMajor (major) {
      this.$ga.event(String(MAJOR), MAJOR.CHOOSE, major)
      await this.$store.dispatch(CREATE_SCHEDULE__SELECT_MAJOR, major)
    },
    async setTypedScheduleName (typedScheduleName) {
      this.$ga.event(String(SCHEDULE), SCHEDULE.TYPING_NAME, this.$route.name)
      await this.$store.dispatch(CREATE_SCHEDULE__LOAD_TYPED_SCHEDULE_NAME, typedScheduleName)
    },
    async saveSchedule () {
      const createdSchedule = await this.$store.dispatch(CREATE_SCHEDULE__SAVE_SCHEDULE)
      if (createdSchedule) {
        this.isShowingCurrentChosenTable = false
        await this.$router.pushAsync({ name: 'view-schedule',
          params: {
            scheduleId: createdSchedule.id
          }
        })
      }
    },
    showCurrentChosenTable () {
      this.isShowingCurrentChosenTable = true
    },
    showHelpFile () {
      this.$ga.event(String(FILE), FILE.HELP_SCHEDULE, this.$route.name)
      this.isShowingHelpFile = true
    },
    openFaqCollapsibleOfIdx (idx) {
      this.$ga.event(String(FILE), FILE.FAQ_SCHEDULE, this.fileFaq[idx].question)
      this.$root.$emit('bv::toggle::collapse', `accordion-${idx}`)
    },
    uploadFileToBackend (isAnonymous) {
      this.$store.dispatch(CREATE_SCHEDULE__UPLOAD_FILE_TO_BACKEND, isAnonymous)
    }
  }
}
</script>

<style lang="scss" scoped>

#create-schedule {
  min-height: $min-window-height;
  padding: 3rem 1rem;
}

#choose-major-form {
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

#button-current-schedule {
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
  box-shadow: 0px 20px 20px -10px rgba(0,64,128,0.2);

  &:hover {
    background-image: $gradient-yellow-dark;
  }
}

#button-help-file {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  margin-bottom: 0.25rem;
}

.contributor {
  font-size: 13px;
  @include sm {
    font-size: 14px;
  }
  @include md {
    font-size: 15px;
  }
  @include lg {
    font-size: 16px;
  }
}

.button-current-schedule-enter-active {
  animation: button-current-schedule .5s;
}
.button-current-schedule-leave-active {
  animation: button-current-schedule .5s reverse;
}

@keyframes button-current-schedule {
  from {
    bottom: 0px;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

.card-header.collapsible-header {
  cursor: pointer;
}

</style>
