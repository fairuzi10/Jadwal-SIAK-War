<template>
  <div class="p-5">
    <h1 class="text-center">
      Jadwal SIAK War
    </h1>
    <div class="text-center row justify-content-center">
      <div class="col-xl-3 col-lg-4 col-md-5 col-sm-6 col-7 my-3">
        <img
          id="logo"
          class="img-fluid"
          src="@/assets/logo.png"
        >
      </div>
      <div class="col-12 mb-5">
        <i id="alt-logo">Susun jadwalmu dan jadilah pemenangnya!</i>
      </div>
      <div class="col-12">
        <h3>Persiapkan SIAK War dengan 3 langkah mudah</h3>
      </div>
      <div class="col-12 col-md-4 img-explanation-wrapper">
        <img
          src="./open-jadwal-siak-war.png"
          alt="Buka situs 'Jadwal SIAK War'"
          class="img-fluid img-explanation"
        >
        Buka situs 'Jadwal SIAK War'.
      </div>
      <div class="col-12 col-md-4 img-explanation-wrapper">
        <img
          src="./create-schedule.png"
          alt="Susun jadwalmu"
          class="img-fluid img-explanation"
        >
        Susun jadwal yang kamu inginkan.
      </div>
      <div class="col-12 col-md-4 img-explanation-wrapper">
        <img
          src="./create-more-plan.png"
          alt="Buat jadwal lain sebagai rencana cadangan!"
          class="img-fluid img-explanation"
        >
        Buat jadwal lain sebagai rencana cadangan!
      </div>
    </div>
    <div class="col-12 text-center">
      <button
        id="button-start-create-schedule"
        class="btn btn-yellow"
        @click="goToCreateSchedule"
      >
        <b>Mulai Buat Jadwal</b>
      </button>
    </div>
  </div>
</template>

<script>
import { SCHEDULE } from '@/analytics.type'

export default {
  name: 'Home',
  metaInfo: {
    title: 'Jadwal SIAK War',
    meta: [
      { name: 'description', content: 'Susun Jadwal SIAK War, cara praktis mempersiapkan SIAK War' }
    ]
  },
  methods: {
    async goToCreateSchedule () {
      this.$ga.event(String(SCHEDULE), SCHEDULE.CREATE, this.$route.name)
      await this.$router.pushAsync({ name: 'create-schedule' })
    }
  }
}
</script>

<style lang="scss" scoped>
#alt-logo {
  font-size: 1.1rem;
}
.img-explanation {
  box-shadow: 0px 20px 20px -10px rgba(0,64,128,0.2);
  margin-bottom: 1rem;
}

.img-explanation-wrapper {
  cursor: pointer;
  transition: transform .15s;
  padding: 1rem 3rem;

  @include md {
    &:hover {
      transform: scale(1.2);
      z-index: 1;
    }
  }
}

#button-start-create-schedule {
  font-size: 1.3rem;
  margin: 3rem 1rem;

  padding: 0.5rem 1.5rem;
  @include md {
    padding: 0.5rem 2rem;
  }
  @include lg {
    padding: 0.5rem 2.5rem;
  }
  @include xl {
    padding: 0.5rem 3rem;
  }
}
</style>
