<template>
  <div>
    <template v-if="!isLoadingClassOptions">
      <div
        v-if="!isEmptyObject(classOptions)"
        class="filter-box"
      >
        <h5>Filter</h5>
        <input
          :value="filter"
          class="form-control mb-2"
          type="text"
          aria-describedby="filter-class"
          placeholder="Filter nama kelas/dosen"
          @input="setFilter($event.target.value)"
        >
        <div class="form-group form-check">
          <input
            id="filter-selected"
            :checked="filterChosenClass"
            type="checkbox"
            class="form-check-input"
            @input="setFilterChosenClass($event.target.checked)"
          >
          <label
            class="form-check-label"
            for="filter-selected"
          >Kelas dipilih</label>
        </div>
      </div>

      <div v-if="!isEmptyObject(classOptions)">
        <div class="d-flex justify-content-between mb-2">
          <span>
            <transition
              name="fade"
              mode="out-in"
            >
              <h5
                :key="totalCredit"
                class="d-inline ml-4"
              >
                {{ totalCredit }}
              </h5>
            </transition>
            <h5 class="d-inline">
              SKS dipilih
            </h5>
          </span>
          <transition>
            <button
              class="btn btn-red"
              @click.prevent="reset"
            >
              Reset
            </button>
          </transition>
        </div>

        <div class="progress mb-3">
          <div
            class="progress-bar progress-bar-striped progress-bar-animated bg-yellow"
            role="progressbar"
            :aria-valuenow="totalCredit"
            aria-valuemin="0"
            aria-valuemax="24"
            :style="{ width: `${totalCredit * 100 / 24}%` }"
          />
        </div>
      </div>

      <div class="text-center text-md-left my-4">
        <button
          class="btn btn-yellow"
          @click="addOtherActivity"
        >
          <b>+ Tambah kegiatan lain</b>
        </button>
      </div>

      <class-group
        v-for="(curClass, className) in filteredClass"
        :key="className"
        :class-group="curClass"
        class="mb-3"
      />
    </template>
    <class-placeholder v-else />
    <b-modal
      id="conflict-modal"
      v-model="isShowingModal"
      title="Jadwal Bentrok!"
      header-text-variant="light"
      header-class="modal-header-red"
      ok-only
      ok-variant="red"
      @ok="resetConflictList"
      @close="resetConflictList"
      @hide="resetConflictList"
    >
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-for="conflict in conflictList"
        :key="conflict"
        v-html="conflict"
      />
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
import { mapState } from 'vuex'
import ClassGroup from './ClassGroup'
import ClassPlaceholder from './ClassPlaceholder'
import { SCHEDULE, FEATURE_REQUEST } from '@/analytics.type'
import {
  ARRANGE_SCHEDULE__REFRESH,
  ARRANGE_SCHEDULE__FILTER_CLASS_OPTIONS,
  ARRANGE_SCHEDULE__FILTER_IS_CHOSEN_CLASS,
  ARRANGE_SCHEDULE__RESET_CONFLICT_LIST
} from '@/store/actions.type'

export default {
  name: 'ArrangeSchedule',
  components: {
    ClassGroup,
    ClassPlaceholder
  },
  data () {
    return {
      isShowingModal: false,
      isShowingComingSoonFeature: false
    }
  },
  computed: {
    ...mapState({
      filteredClass: state => state.arrangeSchedule.filteredClass,
      filter: state => state.arrangeSchedule.filter,
      filterChosenClass: state => state.arrangeSchedule.filterChosenClass,
      isLoadingClassOptions: state => state.arrangeSchedule.isLoadingClassOptions,
      classOptions: state => state.arrangeSchedule.classOptions,
      conflictList: state => state.arrangeSchedule.conflictList,
      totalCredit: state => state.arrangeSchedule.totalCredit
    })
  },
  watch: {
    conflictList (newList) {
      this.isShowingModal = newList.length > 0
    }
  },
  methods: {
    async reset () {
      this.$ga.event(SCHEDULE.toString(), SCHEDULE.RESET, this.$route.name)
      await this.$store.dispatch(ARRANGE_SCHEDULE__REFRESH)
    },
    async setFilter (filter) {
      await this.$store.dispatch(ARRANGE_SCHEDULE__FILTER_CLASS_OPTIONS, filter)
    },
    async setFilterChosenClass (filterChosenClass) {
      await this.$store.dispatch(ARRANGE_SCHEDULE__FILTER_IS_CHOSEN_CLASS, filterChosenClass)
    },
    async resetConflictList () {
      this.$ga.event(SCHEDULE.toString(), SCHEDULE.CONFLICT, this.$route.name)
      await this.$store.dispatch(ARRANGE_SCHEDULE__RESET_CONFLICT_LIST)
    },
    addOtherActivity () {
      this.$ga.event(FEATURE_REQUEST.toString(), FEATURE_REQUEST.ADD_OTHER_ACTIVITY, this.$route.name)
      this.isShowingComingSoonFeature = true
    }
  }
}
</script>

<style lang='scss' scoped>
.filter-box {
  background-color: $grey0;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  padding: 1rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0px 10px 20px -10px rgba(0,64,128,0.2);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .15s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.bg-yellow {
  background-color: $yellow5;
}
</style>
