<template>
  <div id="view-schedule">
    <h4 class="text-center">
      {{ schedule.name }}
    </h4>
    <schedule-table
      :chosen-class="schedule.chosenClass"
      class="mb-3"
    />
    <div class="d-flex justify-content-between">
      <b>{{ `Total ${schedule.totalCredit} SKS` }}</b>
      <div>
        <button
          class="btn btn-outline-grey mr-2"
          @click="syncWithCalendar"
        >
          <img
            src="https://www.gstatic.com/images/branding/product/1x/calendar_32dp.png"
            style="max-height: 24px;"
          >
          Sync
        </button>
        <router-link :to="{name: 'edit-schedule', scheduleId: schedule.id}">
          <button class="btn btn-outline-grey mr-2">
            Ubah
          </button>
        </router-link>
        <button
          class="btn btn-red"
          @click="showDeleteModal = true"
        >
          Hapus
        </button>
      </div>
    </div>
    <b-modal
      id="delete-jadwal-modal"
      v-model="showDeleteModal"
      title="Hapus Jadwal"
      header-text-variant="light"
      header-class="modal-header-red"
      cancel-variant="outline-grey"
      cancel-title="Batal"
      ok-variant="red"
      ok-title="Hapus"
      @ok="removeSchedule"
    >
      Yakin ingin menghapus jadwal ini?
    </b-modal>

    <b-modal
      v-model="isShowingComingSoonFeature"
      title="Coming Soon"
      header-text-variant="dark"
      ok-variant="yellow"
      ok-only
      header-class="modal-header-yellow"
    >
      Terima kasih atas ketertarikannya. Fitur ini akan hadir segera.
    </b-modal>
  </div>
</template>

<script>
import ScheduleTable from '@/components/ScheduleTable'
import { mapState } from 'vuex'
import { SCHEDULE_LIST__REMOVE } from '@/store/actions.type'
import { SCHEDULE, FEATURE_REQUEST } from '@/analytics.type'

export default {
  name: 'ViewSchedule',
  metaInfo () {
    return {
      title: this.schedule ? this.schedule.name : 'Lihat Jadwal'
    }
  },
  components: {
    ScheduleTable
  },
  data () {
    return {
      showDeleteModal: false,
      editJadwal: false,
      isShowingComingSoonFeature: false
    }
  },
  computed: {
    ...mapState({
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
  },
  methods: {
    async removeSchedule () {
      this.$ga.event(String(SCHEDULE), SCHEDULE.REMOVE, this.$route.name)
      await this.$store.dispatch(SCHEDULE_LIST__REMOVE, this.$route.params.scheduleId)
      await this.$router.pushAsync({ name: 'create-schedule' })
    },
    syncWithCalendar () {
      this.$ga.event(String(FEATURE_REQUEST), FEATURE_REQUEST.SYNC_WITH_CALENDAR, this.$route.name)
      this.isShowingComingSoonFeature = true
    }
  }
}
</script>

<style lang="scss" scoped>
#view-schedule {
  min-height: $min-window-height;
  padding: 3rem 0.25rem;

  @include sm {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>
