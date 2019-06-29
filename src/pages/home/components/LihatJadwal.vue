<template>
  <div id="lihat-jadwal">
    <h4>{{ namaJadwal }}</h4>
    <div class="baris">
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
                <small>{{ kelas.WAKTU }}</small>
                <div><strong>{{ kelas['NAMA KELAS'].replace('Kelas ', '') }}</strong></div>
                <small>{{ kelas.RUANG }}</small>
              </div>
            </div>
          </div>
          <div
            v-for="jam in listJam"
            :key="jam + '-' + hari"
            class="baris-jam"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getObjectOrArray,
  JADWAL_LIST
} from '@/helper/storage'

export default {
  name: 'LihatJadwal',
  props: ['namaJadwal'],
  data () {
    return {
      listHari: ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'],
      // need to sync manually with scss variable
      barisJamHeight: 50
    }
  },
  computed: {
    jadwal () {
      return getObjectOrArray(JADWAL_LIST)[this.namaJadwal]
    },
    chosenJadwalGroupedByDay () {
      const initObject = this.listHari.reduce((acc, hari) => ({ ...acc, [hari]: [] }), {})
      const chosen = this.jadwal.chosenClass
      return Object.keys(chosen).reduce((acc, key) => {
        if (!chosen[key]) {
          return acc
        } else {
          const result = acc
          const clas = chosen[key]
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
    listJam () {
      let min = 24
      let max = 0
      const chosen = this.jadwal.chosenClass
      Object.keys(chosen).forEach(key => {
        if (chosen[key]) {
          const clas = chosen[key]
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
      return (this.waktuDalamJam(waktu) - 8) * this.barisJamHeight + 'px'
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
  flex: 0 0 16.6667%;
  max-width: 16.6667%;
}

.baris-jam {
  height: $baris-jam-height;

  &:nth-child(3) {
    border-top: 1px dashed $green-dark;
  }

  &:not(:last-child) {
    border-left: 1px solid $green-dark;
    border-bottom: 1px dashed $green-dark;
  }
}

.baris-penanda-jam {
  height: $baris-jam-height;
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
  line-height: 0.6rem;
  @include sm {
    font-size: 0.7rem;
    line-height: 0.7rem;
  }
  @include md {
    font-size: 0.8rem;
    line-height: 0.8rem;
  }
}

#lihat-jadwal {
  min-height: $min-window-height;
  padding: 3rem 0.25rem;
  text-align: center;

  @include sm {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>
