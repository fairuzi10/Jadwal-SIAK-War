<template>
  <div>
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
      header-class="modal-header-red"
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
    classFiltered: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      conflictList: [],
      showModal: false
    }
  },
  computed: {
    ...mapGetters(['chosenClass'])
  },
  watch: {
    conflictList (newList, oldList) {
      this.showModal = newList.length > 0
    }
  },
  methods: {
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
