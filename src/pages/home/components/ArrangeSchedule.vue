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
          >Kelas terpilih</label>
        </div>
      </div>

      <div class="text-right">
        <button
          class="btn btn-red"
          @click.prevent="reset"
        >
          Reset
        </button>
      </div>

      <course-group
        v-for="(curClass, className) in filteredClass"
        :key="className"
        :class-group="curClass"
        class="mb-3"
      />
    </template>
    <course-placeholder v-else />
    <b-modal
      id="conflict-modal"
      v-model="isShowingModal"
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
import CourseGroup from './ClassGroup'
import CoursePlaceholder from './ClassPlaceholder'
import {
  ARRANGE_SCHEDULE__REFRESH,
  ARRANGE_SCHEDULE__FILTER_CLASS_OPTIONS,
  ARRANGE_SCHEDULE__FILTER_IS_CHOSEN_CLASS
} from '@/store/actions.type'

export default {
  name: 'ArrangeSchedule',
  components: {
    CourseGroup,
    CoursePlaceholder
  },
  data () {
    return {
      isShowingModal: false
    }
  },
  computed: {
    ...mapGetters({
      filteredClass: 'arrangeSchedule_filteredClass',
      chosenClass: 'arrangeSchedule_chosenClass',
      filter: 'arrangeSchedule_filter',
      filterChosenClass: 'arrangeSchedule_filterChosenClass',
      isLoadingClassOptions: 'arrangeSchedule_isLoadingClassOptions',
      classOptions: 'arrangeSchedule_classOptions',
      conflictList: 'arrangeSchedule_conflictList'
    })
  },
  watch: {
    conflictList (newList) {
      this.isShowingModal = newList.length > 0
    }
  },
  methods: {
    reset () {
      this.$store.dispatch(ARRANGE_SCHEDULE__REFRESH)
    },
    setFilter (filter) {
      this.$store.dispatch(ARRANGE_SCHEDULE__FILTER_CLASS_OPTIONS, filter)
    },
    setFilterChosenClass (filterChosenClass) {
      this.$store.dispatch(ARRANGE_SCHEDULE__FILTER_IS_CHOSEN_CLASS, filterChosenClass)
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
</style>
