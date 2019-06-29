<template>
  <!-- eslint-disable vue/no-v-html -->
  <b-card
    :title="clas.name"
    class="mb-3 course-card"
  >
    <div class="course">
      <div
        v-for="classIns in clas.options"
        :key="classIns.NO"
        class="class-card"
        :class="{ active: chosen == classIns }"
        @click="updateChosenClassIns(clas.name, classIns)"
      >
        <b-row>
          <b-col
            cols="2"
            class="kolom-info"
          >
            {{ classIns['NAMA KELAS'] }}
          </b-col>
          <b-col
            cols="3"
            class="kolom-info"
            v-html="classIns.WAKTU.join('<br />')"
          />
          <b-col
            cols="2"
            class="kolom-info"
            v-html="classIns.RUANG.join('<br />')"
          />
          <b-col
            cols="5"
            class="kolom-info"
            v-html="classIns.PENGAJAR.join('<br />')"
          />
        </b-row>
      </div>
    </div>
  </b-card>
</template>

<script>
export default {
  name: 'Course',
  props: {
    clas: {
      type: Object,
      required: true
    },
    chosen: {
      type: Object,
      default: null
    },
    updateChosenClassIns: {
      type: Function,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.course {
  border: 1px solid $green-dark;
  border-radius: 0.25rem;
}

.class-card {
  cursor: pointer;
  font-size: 0.5rem;
  padding: 0.2rem 0.75rem;
  color: $green-dark;
  background-color: $white;
  transition: background-color 0.15s ease-in-out;

  // to make the border from course visible
  &:first-child {
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
  }
  &:last-child {
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }

  &:not(:last-child) {
    border-bottom: 1px solid $green-dark;
  }

  // disable hover effect on mobile devices
  &:hover {
    background-color: $white;
  }
  @include sm {
    font-size: 0.6rem;
  }
  @include md {
    font-size: 0.7rem;
    &:hover {
      background-color: $yellow1;
      color: $green-dark;
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

.class-card:not(:disabled):not(.disabled).active:focus, .show > .btn-secondary.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(130, 138, 145, 0.5);
}

.class-card:not(:disabled):not(.disabled).active {
  background-color: $yellow3;
  color: $green-dark;
}

.class-card:not(:disabled):not(.disabled):not(.active) {
  box-shadow: 0 0 0 0;
}
</style>
