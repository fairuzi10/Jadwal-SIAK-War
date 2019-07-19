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
          class="form-control"
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
              class="mr-2"
              :placeholder="suggestedScheduleName"
              :state="isValidTypedScheduleName"
              @change="setTypedScheduleName"
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
        :state="isValidTypedScheduleName"
        class="text-right"
      >
        Kamu telah memiliki jadwal dengan nama yang sama.
      </b-form-invalid-feedback>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TabelJadwal from './TabelJadwal'
import ArrangeSchedule from './ArrangeSchedule'
import {
  CREATE_SCHEDULE__UPLOAD_FILE,
  CREATE_SCHEDULE__SELECT_MAJOR,
  CREATE_SCHEDULE__SAVE_SCHEDULE,
  CREATE_SCHEDULE__LOAD_TYPED_SCHEDULE_NAME
} from '@/store/actions.type'

export default {
  name: 'BuatJadwal',

  components: {
    TabelJadwal,
    ArrangeSchedule
  },

  data () {
    return {
      majorList: [
        { label: 'Pilih Jurusanmu', value: null },
        ...[
          { label: 'Ilmu Komputer', value: 'ilmu-komputer' },
          { label: 'Teknik Elektro', value: 'teknik-elektro' },
          { label: 'Farmasi', value: 'farmasi' }
        ].sort((a, b) => a.label.localeCompare(b.label))
      ],
      loading: false,
      showCurrentChosenTable: false
    }
  },
  computed: {
    ...mapGetters({
      file: 'createSchedule_file',
      major: 'createSchedule_major',
      isValidFile: 'createSchedule_isValidFile',
      chosenClass: 'arrangeSchedule_chosenClass',
      suggestedScheduleName: 'createSchedule_suggestedScheduleName',
      isValidTypedScheduleName: 'createSchedule_isValidTypedScheduleName'
    })
  },
  methods: {
    setFile (file) {
      this.$store.dispatch(CREATE_SCHEDULE__UPLOAD_FILE, file)
    },
    setMajor (major) {
      this.$store.dispatch(CREATE_SCHEDULE__SELECT_MAJOR, major)
    },
    setTypedScheduleName (typedScheduleName) {
      this.$store.dispatch(CREATE_SCHEDULE__LOAD_TYPED_SCHEDULE_NAME, typedScheduleName)
    },
    saveSchedule () {
      this.$store.dispatch(CREATE_SCHEDULE__SAVE_SCHEDULE)
      this.scrollIntoView('top-view')
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

</style>
