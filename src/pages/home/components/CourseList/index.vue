<template>
  <div>
    <div class="filter-box">
      <h5>Filter</h5>
      <input
        v-model="filter"
        class="form-control"
        type="text"
        aria-describedby="filter-class"
        placeholder="Filter nama kelas/dosen"
      >
    </div>
    <course
      v-for="(curClass, className) in classFiltered"
      :key="className"
      :clas="curClass"
      :chosen="chosenClass[className]"
      class="mb-3"
      :update-chosen-class-ins="updateChosenClassIns"
    />
    <b-modal
      id="conflict-modal"
      v-model="showModal"
      title="Jadwal Bentrok!"
      header-text-variant="light"
      ok-only
      ok-variant="red"
    >
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-for="conflict in conflictList"
        :key="conflict"
        v-html="conflict"
      />
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Course from './Course'
import { UPDATE_CHOSEN_CLASS_INS } from '@/store'
import { BModal } from 'bootstrap-vue'

export default {
  name: 'CourseList',
  components: {
    Course,
    BModal
  },
  props: {
    classOpt: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      conflictList: [],
      showModal: false,
      filter: null,
      classFiltered: { ...this.classOpt }
    }
  },
  computed: {
    ...mapGetters(['chosenClass'])
  },
  watch: {
    conflictList (newList, oldList) {
      this.showModal = newList.length > 0
    },
    filter (newFilter, oldFilter) {
      if (newFilter) {
        const upperCasedFilter = newFilter.toUpperCase()
        const filteredClassName = Object.keys(this.classOpt).filter(className =>
          this.matchClassName(className, upperCasedFilter) ||
          this.matchClassInsName(className, upperCasedFilter) ||
          this.matchLecturerName(className, upperCasedFilter)
        )
        this.classFiltered = filteredClassName.reduce((acc, className) => ({
          [className]: this.classOpt[className], ...acc
        }), {})
      } else {
        this.classFiltered = { ...this.classOpt }
      }
    }
  },
  methods: {
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
        .map(classIns => classIns['PENGAJAR'].join(', '))
        .join(', ')
      const cleanLecturersName = lecturersName.toUpperCase()
      return cleanLecturersName.includes(upperCasedFilter)
    },
    updateChosenClassIns (className, classIns) {
      this.conflictList = this.validateClasInsNotConflict(className, classIns)
      if (this.conflictList.length === 0) {
        this.$store.dispatch(UPDATE_CHOSEN_CLASS_INS, {
          className,
          // if selected twice, unselect
          selected: classIns === this.chosenClass[className] ? null : classIns
        })
      }
    },
    validateClasInsNotConflict (className, clasIns) {
      let conflictList = []
      clasIns['WAKTU'].forEach(hariwaktu => {
        conflictList = conflictList.concat(this.validateHariWaktuNotConflict(className, hariwaktu))
      })
      return conflictList
    },
    validateHariWaktuNotConflict (className, hariwaktu) {
      const splitted = hariwaktu.split(', ')
      const hari = splitted[0]
      const waktu = splitted[1]

      const getWaktuInMinute = (waktu) => {
        return Number(waktu.substr(0, 2)) * 60 + Number(waktu.substr(3, 2))
      }

      const waktuAwal = getWaktuInMinute(waktu.substr(0, 5))
      const waktuAkhir = getWaktuInMinute(waktu.substr(6, 5))

      const conflictList = []
      Object.keys(this.chosenClass).forEach(cmpClassName => {
        if (className !== cmpClassName && this.chosenClass[cmpClassName]) {
          const cmpArrHariwaktu = this.chosenClass[cmpClassName]['WAKTU']
          cmpArrHariwaktu.forEach(cmpHariwaktu => {
            const cmpSplitted = cmpHariwaktu.split(', ')
            const cmpHari = cmpSplitted[0]
            const cmpWaktu = cmpSplitted[1]
            const cmpWaktuAwal = getWaktuInMinute(cmpWaktu.substr(0, 5))
            const cmpWaktuAkhir = getWaktuInMinute(cmpWaktu.substr(6, 5))
            if (hari === cmpHari && !(cmpWaktuAkhir < waktuAwal || waktuAkhir < cmpWaktuAwal)) {
              conflictList.push('Bentrok dengan  <b>' + this.chosenClass[cmpClassName]['NAMA KELAS'] + '</b> pada <b>' + cmpHariwaktu + '</b>')
            }
          })
        }
      })
      return conflictList
    }
  }
}
</script>

<style lang="scss">
.modal-header {
  background: $gradient-red;
}

.btn.btn-red {
  background: $gradient-red;
  color: $light;
  &:hover {
    color: $light;
  }
}

.filter-box {
  background-image: $gradient-yellow;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  padding: 1rem 2rem;
  margin-bottom: 2rem;
}
</style>
