<template>
  <div
    id="schedule-list"
    class="pt-5"
  >
    <div class="bg-gradient-yellow p-1 mb-3">
      <h4>Jadwal Tersimpan</h4>
    </div>
    <div v-if="isEmptyObject(scheduleList)">
      Belum ada jadwal tersimpan
    </div>
    <div class="px-4 pb-3">
      <div
        v-for="schedule in scheduleList"
        :key="schedule.id"
        class="mb-3 schedule-card"
        :class="{ selected: schedule.id === $route.params.scheduleId }"
      >
        <div>
          {{ schedule.name }}
          <router-link
            :to="{ name: 'view-schedule', params: { scheduleId: schedule.id } }"
          >
            <button
              class="choose-schedule yellow-block-button"
            >
              Lihat
            </button>
          </router-link>
        </div>
      </div>
      <hr>
      <button
        class="yellow-block-button my-4 py-2"
        @click="goToCreateSchedule"
      >
        Buat Jadwal Baru
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { SCHEDULE } from '@/analytics.type'

export default {
  name: 'ScheduleList',
  computed: {
    ...mapState({
      scheduleList: state => state.scheduleList.scheduleList
    })
  },
  methods: {
    async goToCreateSchedule () {
      this.$ga.event(SCHEDULE.toString(), SCHEDULE.CREATE, 'schedule-list')
      await this.$router.pushAsync({ name: 'create-schedule' })
    }
  }
}
</script>

<style lang="scss" scoped>
#schedule-list {
  text-align: center;
  background-color: $grey0;
}

.yellow-block-button {
  color: $dark;
  background-image: $gradient-yellow;
  display: block;
  width: 100%;
  font-weight: bold;
  border-radius: $border-radius;
  outline: 0;
  border: 1px solid $yellow5;
  padding: 0.25rem 1rem;

  &:hover {
    transition: all 0.15s ease-in-out;
    background-image: $gradient-yellow-dark;
  }

  &:focus {
    outline: 0;
  }
}

.schedule-card {
  font-size: 0.9rem;
  font-weight: bold;
  padding: 16px;
  color: $dark;
  background-color: $white;
  border-radius: $border-radius;
  border: 1px solid rgba(0,0,0,.125);
  box-shadow: 0px 10px 40px -10px rgba(0,64,128,0.2);
}

#choose-schedule.btn {
  margin: 2px;
}

.white-border {
  border-color: white;
}

.selected {
  transition: all 0.15s ease-in-out;
  background-color: $yellow1;
}
</style>
