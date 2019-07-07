<template>
  <home />
</template>

<script>
import './mixin'
import store from './store'
import Home from '@/pages/home'

export default {
  store,
  name: 'App',
  components: {
    Home
  }
}
</script>

<style lang="scss">
// hacky trick to avoid override bootstrap variables
$border-radius: 0.25rem;
// place in the bottom to support overriding variables
@import "~bootstrap/scss/bootstrap.scss";
@import "~bootstrap-vue/src/index.scss";

body {
  color: $dark;
}
h1 {
  font-weight: bold;
}
h2 {
  font-weight: bold;
}
h3 {
  font-weight: bold;
}
h4 {
  font-weight: bold;
}
h5 {
  font-weight: bold;
}

.modal {
  padding-left: 0 !important;
}

.modal-header-red {
  background: $gradient-red;
}
.modal-header-yellow {
  background: $gradient-yellow;
}
.btn.btn-red {
  background: $gradient-red;
  color: $light;
  &:hover {
    color: $light;
  }
}
.btn.btn-yellow{
  background: $gradient-yellow;
  color: $dark;
  &:hover {
    color: $dark;
  }
}
</style>
