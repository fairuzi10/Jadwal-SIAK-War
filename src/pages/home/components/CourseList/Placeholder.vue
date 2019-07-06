<template>
  <div>
    <div class="blinked">
      <div class="row">
        <div class="col-3 placeholder big empty px-2" />
        <div class="col-6 placeholder big px-2" />
        <div class="col-3 placeholder big empty px-2" />
      </div>

      <div class="ph-btn-group">
        <div
          v-for="i in 3"
          :key="i"
          class="ph-btn"
        >
          <div class="row">
            <div
              class="col-2 placeholder px-2"
            />
            <div
              class="col-1 placeholder empty px-2"
            />
            <div
              class="col-2 placeholder px-2"
            />
            <div
              class="col-1 placeholder empty px-2"
            />
            <div
              class="col-2 placeholder px-2"
            />
            <div
              class="col-1 placeholder empty px-2"
            />
            <div
              class="col-3 placeholder px-2"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.ph-btn {
  width: 100%;
  border: 1px solid transparent;
  border-color: $border-color;
  border-radius: 0.25rem;

  &:not(:first-child) {
    margin-top: -1px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  &:not(:last-child) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}

.card-body {
  padding: 0.5rem;
}

.row {
  margin: 0.5rem;
}

.placeholder {
  height: 15px;

  &:not(.empty) {
    background-color: $yellow1;
  }

  &.empty {
    background-color: inherit;
  }

  &.big {
    height: 30px;
  }
}

.blinked {
  animation: blinker 1.5s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0.3;
  }
}
</style>
