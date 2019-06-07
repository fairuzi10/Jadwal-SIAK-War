<template>
  <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.lds-ring {
  display: inline-block;
  position: relative;
  width: 160px;
  height: 160px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 150px;
  height: 150px;
  margin: 6px;
  border: 20px solid $green-dark;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: $green-light transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
  border-color: $green-dark
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
