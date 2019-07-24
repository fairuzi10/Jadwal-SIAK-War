<template>
  <div id="edit-schedule">
    <h3 class="text-center">
      {{ `Ubah ${schedule.name}` }}
    </h3>

    <arrange-schedule />

    <transition name="button-current-schedule">
      <button
        v-if="!allValueOfObjectIsNull(chosenClass)"
        id="button-current-schedule"
        @click="showCurrentChosenTable"
      >
        Lihat Hasil Perubahan
      </button>
    </transition>

    <b-modal
      v-model="isShowingCurrentChosenTable"
      :title="`${schedule.name} Sementara`"
      header-text-variant="dark"
      header-class="modal-header-yellow schedule-table"
      dialog-class="schedule-table"
      hide-footer
      @hide="backToArrangeSchedule"
    >
      <schedule-table :chosen-class="chosenClass" />
      <div class="mt-3">
        <form class="form-inline justify-content-end">
          <button
            class="btn btn-yellow btn-sm my-2"
            @click.prevent="saveSchedule"
          >
            <b>Simpan</b>
          </button>
        </form>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ScheduleTable from '@/components/ScheduleTable'
import ArrangeSchedule from '@/components/ArrangeSchedule'
import { SCHEDULE } from '@/analytics.type'
import {
  ARRANGE_SCHEDULE__LOAD_CLASS_OPTIONS,
  SCHEDULE_LIST__CHANGE
} from '@/store/actions.type'

export default {
  name: 'EditSchedule',
  metaInfo () {
    return {
      title: `Ubah ${this.schedule.name}`
    }
  },
  components: {
    ScheduleTable,
    ArrangeSchedule
  },
  data () {
    return {
      isShowingCurrentChosenTable: false
    }
  },
  computed: {
    ...mapState({
      chosenClass: state => state.arrangeSchedule.chosenClass,
      totalCredit: state => state.arrangeSchedule.totalCredit,
      scheduleList: state => state.scheduleList.scheduleList
    }),
    schedule () {
      return this.scheduleList.find(schedule => schedule.id === this.$route.params.scheduleId)
    }
  },
  async created () {
    if (!this.schedule) {
      await this.$router.pushAsync({ name: '404' })
    }
    await this.$store.dispatch(ARRANGE_SCHEDULE__LOAD_CLASS_OPTIONS, {
      classOptions: this.schedule.classOptions,
      chosenClass: this.schedule.chosenClass,
      isCreateSchedule: false
    })
  },
  methods: {
    async saveSchedule () {
      const edittedSchedule = this.schedule
      edittedSchedule.chosenClass = this.chosenClass
      edittedSchedule.totalCredit = this.totalCredit
      await this.$store.dispatch(SCHEDULE_LIST__CHANGE, edittedSchedule)
      this.isShowingCurrentChosenTable = false
      this.$router.pushAsync({ name: 'view-schedule',
        params: {
          scheduleId: edittedSchedule.id
        }
      })
    },
    showCurrentChosenTable () {
      this.$ga.event(SCHEDULE.toString(), SCHEDULE.SHOW_CURRENT_CHOSEN_TABLE, this.$route.name)
      this.isShowingCurrentChosenTable = true
    },
    backToArrangeSchedule () {
      this.$ga.event(SCHEDULE.toString(), SCHEDULE.BACK_TO_ARRANGE_SCHEDULE, this.$route.name)
    }
  }
}
</script>

<style lang="scss" scoped>

#edit-schedule {
  min-height: $min-window-height;
  padding: 3rem 1rem;
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
