<template>
  <div>
    <course
      :clas="curClass"
      :chosen="chosenClass[className]"
      class="mb-3"
      v-for="(curClass, className) in classOpt" :key="className"
      :updateChosenClassIns="updateChosenClassIns"
    />
    <b-modal id="conflict-modal"
      v-model="showModal"
      title="Jadwal Bentrok!"
      headerTextVariant="light"
      ok-only
      ok-variant="green-dark"
    ><div v-for="conflict in conflictList" :key="conflict">{{conflict}}</div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Course from '@/components/Course'
import { UPDATE_CHOSEN_CLASS_INS } from '@/store'

export default {
  name: 'course-list',
  props: {
    classOpt: {
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
              conflictList.push('Bentrok dengan ' + this.chosenClass[cmpClassName]['NAMA KELAS'] + ' pada ' + cmpHariwaktu)
            }
          })
        }
      })
      return conflictList
    }
  },
  computed: {
    ...mapGetters(['chosenClass'])
  },
  watch: {
    conflictList: function (newList, oldList) {
      this.showModal = newList.length > 0
    }
  },
  components: {
    Course
  }
}
</script>

<style>
.modal-header {
  background: linear-gradient(40deg, #ED213A, #93291E);
}
</style>
