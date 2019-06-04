<template>
  <b-card-body class="btn-group-toggle btn-group-vertical btn-block">
    <b-button variant="outline-green-light"
      class="class-card"
      v-for="classIns in clas.options"
      :key="classIns.NO"
      :class="{ active: chosen == classIns }"
      @click="updateChosenClassIns(classIns)"
    >
      <b-row>
        <b-col cols="2">
          {{classIns['NAMA KELAS']}}
        </b-col>
        <b-col cols="3" v-html="classIns.WAKTU.join('<br />')">
        </b-col>
        <b-col cols="2" v-html="classIns.RUANG.join('<br />')">
        </b-col>
        <b-col cols="5" v-html="classIns.PENGAJAR.join('<br />')">
        </b-col>
      </b-row>
    </b-button>
  </b-card-body>
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
    chosen: String
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
</style>
