<template>
  <div>
    <course
      :clas="curClass"
      :chosen="chosenClass[className]"
      class="mb-3"
      v-for="(curClass, className) in classOpt" :key="className"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Course from '@/components/Course'

export default {
  name: 'course-list',
  props: {
    classOpt: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(['chosenClass'])
  },
  components: {
    Course
  }
}
</script>
