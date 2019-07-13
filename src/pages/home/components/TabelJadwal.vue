<template>
  <div>
    <div class="baris mb-2">
      <div id="kolom-penanda-jam">
        <div
          v-for="jam in listJam"
          :key="jam + '-baris-penanda'"
          class="baris-penanda-jam"
        >
          <strong>{{ jam + '.00' }}</strong>
        </div>
      </div>
      <div
        id="kolom-wrapper"
        class="baris"
      >
        <div
          v-for="hari in listHari"
          :key="hari"
          class="kolom-hari"
        >
          <span class="hari">{{ capitalize(hari) }}</span>
          <div class="anceran">
            <div
              v-for="kelas in chosenJadwalGroupedByDay[hari]"
              :key="kelas.RUANG + '-' + kelas.WAKTU"
              class="posisi-kotak-jadwal"
              :style="{top: waktuToTopOffset(kelas.WAKTU)}"
            >
              <div
                class="kotak-jadwal"
                :style="{ height: waktuToHeight(kelas.WAKTU) }"
              >
                {{ kelas.WAKTU }}
                <div><strong>{{ kelas['NAMA KELAS'].replace('Kelas ', '') }}</strong></div>
                {{ kelas.RUANG }}
              </div>
            </div>
          </div>
          <div
            v-for="jam in listJam.slice(0, listJam.length - 1)"
            :key="jam + '-' + hari"
            class="baris-jam"
          />
        </div>
      </div>
    </div>
    <div
      v-for="kelas in specialClass"
      :key="kelas['NAMA KELAS']"
    >
      <strong>{{ '+ ' + kelas['NAMA KELAS'].replace('Kelas ', '') }}</strong>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabelJadwal',
  props: {
    jadwal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // need to sync manually with scss variable
      barisJamHeight: 50
    }
  },
  computed: {
    classWithTime () {
      const filteredKey = Object.keys(this.jadwal).filter(key => this.jadwal[key] && this.jadwal[key]['WAKTU'])
      return filteredKey.reduce((acc, key) => ({ ...acc, [key]: this.jadwal[key] }), {})
    },
    specialClass () {
      const filteredKey = Object.keys(this.jadwal).filter(key => this.jadwal[key] && !this.jadwal[key]['WAKTU'])
      return filteredKey.reduce((acc, key) => ({ ...acc, [key]: this.jadwal[key] }), {})
    },
    chosenJadwalGroupedByDay () {
      const initObject = this.listHari.reduce((acc, hari) => ({ ...acc, [hari]: [] }), {})
      return Object.keys(this.classWithTime).reduce((acc, key) => {
        if (!this.classWithTime[key]) {
          return acc
        } else {
          const result = acc
          const clas = this.classWithTime[key]
          // corner case, different time period (month or sth) but same schedule
          const filtered = clas['WAKTU'].map((waktu, idx) => {
            for (let i = 0; i < idx; i++) {
              if (waktu === clas['WAKTU'][i]) {
                return false
              }
            }
            return true
          })
          const waktu = clas['WAKTU'].filter((waktu, idx) => filtered[idx])
          const ruang = clas['RUANG'].filter((ruang, idx) => filtered[idx])

          waktu.forEach((hariwaktu, idx) => {
            const splitted = hariwaktu.split(', ')
            const hari = splitted[0].toLowerCase()
            const waktu = splitted[1]

            result[hari].push({
              'NAMA KELAS': clas['NAMA KELAS'],
              'RUANG': ruang[idx],
              'WAKTU': waktu
            })
          })
          return result
        }
      }, initObject)
    },
    listHari () {
      const result = ['senin', 'selasa', 'rabu', 'kamis', 'jumat']
      let sabtuExist = false
      Object.keys(this.classWithTime).forEach(key => {
        if (this.classWithTime[key]) {
          const clas = this.classWithTime[key]
          clas['WAKTU'].forEach((hariwaktu, idx) => {
            const hari = hariwaktu.split(', ')[0]
            if (hari.toLowerCase() === 'sabtu') {
              sabtuExist = true
            }
          })
        }
      })
      if (sabtuExist) result.append('sabtu')
      return result
    },
    listJam () {
      let min = 24
      let max = 0
      Object.keys(this.classWithTime).forEach(key => {
        if (this.classWithTime[key]) {
          const clas = this.classWithTime[key]
          clas['WAKTU'].forEach((hariwaktu, idx) => {
            const waktu = hariwaktu.split(', ')[1]
            const jamAwal = Number(waktu.substr(0, 2))
            const jamAkhir = Number(waktu.substr(6, 2)) + 1
            min = Math.min(min, jamAwal)
            max = Math.max(max, jamAkhir)
          })
        }
      })
      return this.generateList(min, max)
    }
  },
  methods: {
    waktuDalamJam (waktu) {
      const jam = Number(waktu.substr(0, 2))
      const menit = Number(waktu.substr(3, 2))
      return jam + menit / 60
    },
    waktuToTopOffset (waktu) {
      // start from jam 8
      return (this.waktuDalamJam(waktu) - this.listJam[0]) * this.barisJamHeight + 'px'
    },
    waktuToHeight (waktu) {
      const waktuAwal = waktu.substr(0, 5)
      const waktuAkhir = waktu.substr(6, 5)
      const durasi = this.waktuDalamJam(waktuAkhir) - this.waktuDalamJam(waktuAwal)
      return durasi * this.barisJamHeight + 'px'
    },
    generateList (from, to) {
      const result = []
      for (let i = from; i <= to; i++) {
        result.push(i)
      }
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
$baris-jam-height: 50px;

.baris {
  display: flex;
}

.kolom-hari {
  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%;
}

.baris-jam {
  height: $baris-jam-height;

  &:nth-child(3) {
    border-top: 1px dashed $dark;
  }

  border-left: 1px solid $dark;
  border-bottom: 1px dashed $dark;
}

.baris-penanda-jam {
  &:not(:last-child) {
    height: $baris-jam-height;
  }
}

#kolom-wrapper {
  flex-grow: 1;
  max-width: 100%;
}

.anceran {
  position: relative;
}

.posisi-kotak-jadwal {
  position: absolute;
  width: 100%;
  padding: 0 0.1rem 0 0.2rem;
}

.hari {
  font-size: 0.8rem;
  @include sm {
    font-size: 0.9rem;
  }
  @include md {
    font-size: 1rem;
  }
}

#kolom-penanda-jam {
  margin-top: 1rem;
  margin-right: 0.5rem;
  font-size: 0.6rem;
  @include sm {
    font-size: 0.7rem;
    line-height: 0.7rem;
  }
  @include md {
    font-size: 0.8rem;
    line-height: 0.8rem;
  }
}

.kotak-jadwal {
  @include bg-gradient-yellow;
  padding: 0.2rem;
  text-align: left;
  opacity: 0.9;
  border-radius: 0.25rem;
  font-size: 0.6rem;
  line-height: 0.7rem;
  @include sm {
    font-size: 0.7rem;
    line-height: 0.8rem;
  }
  @include md {
    font-size: 0.8rem;
    line-height: 0.9rem;
  }
}
</style>
