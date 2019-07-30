<template>
  <div id="home">
    <h1 class="text-center">
      Jadwal SIAK War
    </h1>
    <div class="text-center row no-gutters justify-content-center">
      <div class="col-xl-3 col-lg-4 col-md-5 col-sm-6 col-7 my-3">
        <img
          id="logo"
          class="img-fluid"
          src="@/assets/logo.png"
        >
      </div>
      <div class="col-12 mb-5">
        <i id="alt-logo">Susun jadwalmu dan jadilah pemenang SIAK War!</i>
      </div>
      <div class="col-12 mb-5">
        <h4 class="mb-3">
          Persiapkan SIAK War dengan 3 langkah mudah
        </h4>
        <h6>1. Buka situs 'Jadwal SIAK War'</h6>
        <h6>2. Susun jadwal yang kamu inginkan</h6>
        <h6>3. Buat jadwal lain sebagai rencana cadangan!</h6>
      </div>
      <div class="col-12">
        <h4 class="mb-4">
          Fitur Unggulan
        </h4>
        <div class="row no-gutters">
          <div class="img-explanation-wrapper">
            <img
              src="./schedule-conflict.png"
              class="img-explanation"
              alt="Deteksi jadwal bentrok"
            >
            <p>Deteksi jadwal bentrok</p>
          </div>
          <div class="img-explanation-wrapper">
            <img
              src="./schedule-table.png"
              class="img-explanation"
              alt="Lihat tabel jadwal"
            >
            <p>Lihat tabel jadwal</p>
          </div>
          <div class="img-explanation-wrapper">
            <img
              src="./plan-more-schedule.png"
              class="img-explanation"
              alt="Buat rencana cadangan"
            >
            <p>Buat rencana cadangan</p>
          </div>
        </div>
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
  height: 250px;
  max-width: 100%;
}

.img-explanation-wrapper {
  cursor: pointer;
  transition: transform .15s;
  padding: 1rem;
  flex: 0 0 100%;

  @include lg {
    width: none;
    flex: 0 0 33.33%;
  }

  @include md {
    &:hover {
      transform: scale(1.2);
      z-index: 1;
    }
  }
}

#button-start-create-schedule {
  font-size: 1.3rem;
  margin: 2rem 1rem;

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
