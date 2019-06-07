<template>
  <b-card
    :title="clas.name"
    class="mb-3"
  >
    <b-card-body class="btn-group-toggle btn-group-vertical btn-block">
      <b-button variant="outline-green-light"
        class="class-card"
        v-for="classIns in clas.options"
        :key="classIns.NO"
        :class="{ active: chosen == classIns }"
        @click="updateChosenClassIns(classIns)"
      >
        <b-row>
          <b-col cols="2" class="px-2">
            {{classIns['NAMA KELAS']}}
          </b-col>
          <b-col cols="3" v-html="classIns.WAKTU.join('<br />')" class="px-2">
          </b-col>
          <b-col cols="2" v-html="classIns.RUANG.join('<br />')" class="px-2">
          </b-col>
          <b-col cols="5" v-html="classIns.PENGAJAR.join('<br />')" class="px-2">
          </b-col>
        </b-row>
      </b-button>
    </b-card-body>
  </b-card>
</template>

<script>
import { UPDATE_CHOSEN_CLASS_INS } from '@/store'

export default {
  name: 'course',
  props: {
    clas: {
      type: Object,
      required: true
    },
    chosen: Object
  },
  methods: {
    updateChosenClassIns (classIns) {
      this.$store.dispatch(UPDATE_CHOSEN_CLASS_INS, {
        className: this.clas.name,
        // if selected twice, unselect
        selected: classIns === this.chosen ? null : classIns
      })
    }
  }
}
</script>

<style scoped>
  .class-card {
    cursor: pointer;
    font-size: 0.9rem;
  }

  .btn-outline-green-light:not(:disabled):not(.disabled).active {
    background-color: #349268;
  }

  .btn-outline-green-light:not(:disabled):not(.disabled):not(.active) {
    box-shadow: 0 0 0 0;
  }
</style>
