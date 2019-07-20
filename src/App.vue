<template>
  <jadwal-siak-war />
</template>

<script>
import './mixin'
import JadwalSiakWar from '@/pages'

export default {
  name: 'App',
  components: {
    JadwalSiakWar
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
.modal-header.schedule-table {
  padding: 0.5rem 1rem;
}
.modal-dialog.schedule-table {
  @media (min-width: 576px) {
    max-width: none;
    margin: 0.5rem;
  }
  @media (min-width: 850px) {
    max-width: 800px;
    margin: 0.5rem auto;
  }
}
.btn.btn-red {
  background: $gradient-red;
  color: $light;
  border-radius: 0.5rem;
  &:hover {
    color: $light;
    background: $gradient-red-dark;
  }
}
.btn.btn-yellow{
  background: $gradient-yellow;
  color: $dark;
  border-radius: 0.5rem;
  &:hover {
    color: $dark;
    background: $gradient-yellow-dark;
  }
}
.btn.btn-outline-grey {
  background: $light;
  color: $dark;
  border-radius: 0.5rem;
  border: 1px solid $dark;
  &:hover {
    background-color: $grey1;
  }
}

a {
  &:hover {
    text-decoration: none;
  }
}
</style>
