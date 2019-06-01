<template>
  <div>
    <b-navbar toggleable="lg" type="dark" class="bg-green-dark">
      <b-navbar-brand href="#">Jadwal SIAK</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"/>
    </b-navbar>
    <b-container fluid>
      <b-row>
        <b-col id="jadwal-tersimpan" cols="12" md="4" order="2" order-md="1" class="dark">
          <h3>Jadwal Tersimpan</h3>
        </b-col>
        <b-col id="buat-jadwal" cols="12" md="8" order="1" order-md="2">
          <h3>Buat Jadwal</h3>
          <b-card title="Cari Pilihan Jadwalmu" tag="article" class="mb-2">
            <b-form>
              <b-form-group>
                <b-form-select
                  id="input-jurusan"
                  v-model="form.jurusan"
                  :options="list_jurusan"
                  required
                />
              </b-form-group>
            </b-form>

            <b-card-text>
              Atau unggah jadwal jurusanmu
              <b-button id="help-upload" href="#" size="sm" variant="info" class="bg-green-dark">?</b-button>
              <b-tooltip ref="tooltip" target="help-upload" placement="bottom">
                Unggah file HTML dari SIAK-mu. Klik untuk info lebih
                lanjut
              </b-tooltip>
            </b-card-text>

            <b-form inline>
              <b-form-file
                v-model="file"
                :state="file"
                placeholder="Choose a file..."
                drop-placeholder="Drop file here..."
                inline
              />
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "JadwalSiak",
  data() {
    return {
      file: null,
      form: {
        jurusan: null
      },
      list_jurusan: [
        { text: "Pilih Jurusanmu", value: null },
        "Ilmu Komputer",
        "Sistem Informasi"
      ]
    };
  },
  methods: {
    handleSelect(key, keyPath) {}
  }
};
</script>

<style scoped>
.bg-green-dark {
  background-color: #2c3e50;
}
.bg-green-light {
  background-color: #41b883;
}

.dark {
  color: #ffffff;
}

#jadwal-tersimpan {
  background-color: #41b883;
  min-height: 700px;
  padding: 2rem;
  text-align: center;
}

#buat-jadwal {
  min-height: 700px;
  padding: 2rem;
  text-align: center;
}

#logo {
  height: 40px;
  width: 40px;
}

body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
