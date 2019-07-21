<template>
  <!-- eslint-disable vue/no-v-html -->
  <!-- eslint-disable vue/valid-v-html -->
  <div
    class="mb-4 class-card"
  >
    <h5 class="text-center">
      {{ classGroup.name }}
    </h5>
    <div class="class">
      <div
        v-for="classInstance in classGroup.options"
        :key="classInstance.NO"
        class="class-instance-card"
        :class="{ active: isSameClassInstance(chosenClass[classGroup.name], classInstance) }"
        @click="chooseOrToggleClassInstance(classGroup.name, classInstance)"
      >
        <div class="row">
          <div
            class="info-col class-col"
          >
            {{ classInstance['NAMA KELAS'] }}
          </div>
          <template v-if="classInstance.WAKTU">
            <div
              class="info-col time-col"
              v-html="classInstance.WAKTU.join('<br />')"
            />
            <div
              class="info-col room-col"
              v-html="classInstance.RUANG.join('<br />')"
            />
            <div
              class="info-col lecturer-col"
              v-html="classInstance.PENGAJAR.join('<br />')"
            />
          </template>
          <!-- special case, tugas akhir/kerja praktik -->
          <div
            v-else
            class="info-col description-col"
          >
            {{ classInstance.PERIODE[0] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ARRANGE_SCHEDULE__CHOOSE_OR_TOGGLE_CLASS_INSTANCE } from '@/store/actions.type'
import { mapGetters } from 'vuex'
import { isSameClassInstance } from '@/helper/utils'

export default {
  name: 'ClassGroup',
  props: {
    classGroup: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      chosenClass: 'arrangeSchedule_chosenClass'
    })
  },
  methods: {
    async chooseOrToggleClassInstance (className, classInstance) {
      await this.$store.dispatch(ARRANGE_SCHEDULE__CHOOSE_OR_TOGGLE_CLASS_INSTANCE, { className, classInstance })
    },
    isSameClassInstance
  }
}
</script>

<style lang="scss" scoped>

.class-col { width: 20% }
.time-col { width: 30% }
.room-col { width: 20% }
.lecturer-col {width: 30% }
.description-col { flex-grow: 1 }

.class {
  border: 1px solid $border-color;
  border-radius: $border-radius;
}

.class-instance-card {
  cursor: pointer;
  font-size: 0.5rem;
  padding: 0.2rem 0.75rem;
  color: $dark;
  background-color: $white;
  transition: background-color 0.15s ease-in-out;

  // to make the border from class visible
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

.info-col {
  padding: 0 0.25rem;
  text-align: center;

  &:first-child {
    padding-left: 0.5rem;
  }
  &:last-child {
    padding-right: 0.5rem;
  }
}

.class-instance-card:not(:disabled):not(.disabled).active {
  background-color: $yellow3;
  color: $dark;
}

.class-instance-card:not(:disabled):not(.disabled).active:focus, .show > .btn-secondary.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(130, 138, 145, 0.5);
}

.class-instance-card:not(:disabled):not(.disabled):not(.active) {
  box-shadow: 0 0 0 0;
}
</style>
