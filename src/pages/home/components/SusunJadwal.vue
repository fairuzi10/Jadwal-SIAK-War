<template>
  <div>
    <template v-if="!isLoadingClassOpt">
      <div
        v-if="!isEmptyObject(classOpt)"
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
            :checked="filterChosen"
            type="checkbox"
            class="form-check-input"
            @input="setFilterChosen($event.target.checked)"
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

      <course-list
        :class-filtered="filteredClass"
      />
    </template>
    <course-placeholder v-else />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CourseList from './CourseList'
import CoursePlaceholder from './CourseList/Placeholder'
import { RESET_ARRANGE_CLASS, FILTER_CLASS_OPT, FILTER_CHOSEN_CLASS_OPT } from '@/store/actions.type'

export default {
  name: 'SusunJadwal',
  components: {
    CourseList,
    CoursePlaceholder
  },
  computed: {
    ...mapGetters(['filteredClass', 'chosenClass', 'filter', 'filterChosen', 'isLoadingClassOpt', 'classOpt'])
  },
  methods: {
    reset () {
      this.$store.dispatch(RESET_ARRANGE_CLASS)
    },
    setFilter (filter) {
      this.$store.dispatch(FILTER_CLASS_OPT, filter)
    },
    setFilterChosen (filterChosen) {
      this.$store.dispatch(FILTER_CHOSEN_CLASS_OPT, filterChosen)
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
