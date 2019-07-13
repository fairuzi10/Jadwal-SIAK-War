<template>
  <!-- eslint-disable vue/no-v-html -->
  <!-- eslint-disable vue/valid-v-html -->
  <div
    class="mb-4 course-card"
  >
    <h5 class="text-center">
      {{ clas.name }}
    </h5>
    <div class="course">
      <div
        v-for="classIns in clas.options"
        :key="classIns.NO"
        class="class-card"
        :class="{ active: chosen == classIns }"
        @click="updateChosenClassIns(clas.name, classIns)"
      >
        <div class="row">
          <div
            class="kolom-info kolom-kelas"
          >
            {{ classIns['NAMA KELAS'] }}
          </div>
          <template v-if="classIns.WAKTU">
            <div
              class="kolom-info kolom-waktu"
              v-html="classIns.WAKTU.join('<br />')"
            />
            <div
              class="kolom-info kolom-ruang"
              v-html="classIns.RUANG.join('<br />')"
            />
            <div
              class="kolom-info kolom-pengajar"
              v-html="classIns.PENGAJAR.join('<br />')"
            />
          </template>
          <!-- special case, tugas akhir/kerja praktik -->
          <div
            v-else
            class="kolom-info kolom-keterangan"
          >
            {{ classIns['PERIODE'][0] }}
          </div>
        </div>
      </div>
    </div>
  </div>
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

.kolom-kelas { width: 20% }
.kolom-waktu { width: 30% }
.kolom-ruang { width: 20% }
.kolom-pengajar {width: 30% }
.kolom-keterangan { flex-grow: 1 }

.course {
  border: 1px solid $border-color;
  border-radius: $border-radius;
}

.class-card {
  cursor: pointer;
  font-size: 0.5rem;
  padding: 0.2rem 0.75rem;
  color: $dark;
  background-color: $white;
  transition: background-color 0.15s ease-in-out;

  // to make the border from course visible
  &:first-child {
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
  }
  &:last-child {
    border-bottom-left-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
  }

  &:not(:last-child) {
    border-bottom: 1px solid $border-color;
  }

  // disable hover effect on mobile devices
  &:hover {
    background-color: $white;
  }
  @include sm {
    font-size: 0.7rem;
  }
  @include md {
    font-size: 0.8rem;
    &:hover {
      background-color: $yellow1;
      color: $dark;
    }
  }
  @include lg {
    font-size: 0.9rem;
  }
}

.card-body {
  padding: 0.5rem;
}

.card-title {
  color: $dark;
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
  text-align: center;

  &:first-child {
    padding-left: 0.5rem;
  }
  &:last-child {
    padding-right: 0.5rem;
  }
}

.class-card:not(:disabled):not(.disabled).active {
  background-color: $yellow3;
  color: $dark;
}

.class-card:not(:disabled):not(.disabled).active:focus, .show > .btn-secondary.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(130, 138, 145, 0.5);
}

.class-card:not(:disabled):not(.disabled):not(.active) {
  box-shadow: 0 0 0 0;
}
</style>
