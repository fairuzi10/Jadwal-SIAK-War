<template>
  <div class="p-5">
    <h1 class="text-center">
      Jadwal SIAK War
    </h1>
    <router-link :to="{ name: 'create-schedule' }">
      Create Schedule
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
