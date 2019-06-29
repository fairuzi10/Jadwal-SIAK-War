<template>
  <b-card
    :title="clas.name"
    class="mb-3"
  >
    <div class="btn-group-toggle btn-group-vertical btn-block">
      <b-button variant="outline-green-light"
        class="class-card"
        v-for="classIns in clas.options"
        :key="classIns.NO"
        :class="{ active: chosen == classIns }"
        @click="updateChosenClassIns(clas.name, classIns)"
      >
        <b-row>
          <b-col cols="2" class="kolom-info">
            {{classIns['NAMA KELAS']}}
          </b-col>
          <b-col cols="3" class="kolom-info" v-html="classIns.WAKTU.join('<br />')">
          </b-col>
          <b-col cols="2" class="kolom-info" v-html="classIns.RUANG.join('<br />')">
          </b-col>
          <b-col cols="5" class="kolom-info" v-html="classIns.PENGAJAR.join('<br />')">
          </b-col>
        </b-row>
      </b-button>
    </div>
  </b-card>
</template>

<script>
export default {
  name: 'course',
  props: {
    clas: {
      type: Object,
      required: true
    },
    chosen: Object,
    updateChosenClassIns: Function
  }
}
</script>

<style lang="scss" scoped>
.class-card {
  cursor: pointer;
  font-size: 0.5rem;
  padding: 0.2rem 0.75rem;

  // disable hover effect on mobile devices
  &:hover {
    background-color: $white;
    color: $green-light;
  }
  @include sm {
    font-size: 0.6rem;
  }
  @include md {
    font-size: 0.7rem;
    &:hover {
      background-color: $green-light;
      color: $white;
    }
  }
  @include lg {
    font-size: 0.8rem;
  }
}

.card-body {
  padding: 0.5rem;
}

.card-title {
  color: $green-dark;
  font-weight: bold;
  font-size: 0.8rem;
  @include sm {
    font-size: 0.9rem;
  }
  @include md {
    font-size: 1rem;
  }
  @include lg {
    font-size: 1.1rem;
  }
}

.kolom-info {
  padding: 0 0.25rem;
}

.btn-outline-green-light:not(:disabled):not(.disabled).active {
  background-color: #349268;
}

.btn-outline-green-light:not(:disabled):not(.disabled):not(.active) {
  box-shadow: 0 0 0 0;
}
</style>
