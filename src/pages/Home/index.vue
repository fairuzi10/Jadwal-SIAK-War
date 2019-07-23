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
  </div>
</template>

<script>
export default {
  name: 'Home',
  metaInfo: {
    title: 'Jadwal SIAK War',
    meta: [
      { name: 'description', content: 'Susun Jadwal SIAK War, cara praktis mempersiapkan SIAK War' }
    ]
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
</style>
