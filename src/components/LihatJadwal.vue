<template>
  <div id="lihat-jadwal">
    <h4>{{namaJadwal}}</h4>
    <div class="baris">
      <div id="kolom-penanda-jam">
        <div class="baris-penanda-jam" v-for="jam in listJam" :key="jam + '-baris-penanda'">
          <strong>{{jam + '.00'}}</strong>
        </div>
      </div>
      <div class="baris" id="kolom-wrapper">
        <div class="kolom-hari" v-for="hari in listHari" :key="hari">
          <span class="hari">{{capitalize(hari)}}</span>
          <div class="anceran">
            <div class="posisi-kotak-jadwal"
              v-for="kelas in chosenJadwalGroupedByDay[hari]"
              :key="kelas.RUANG + '-' + kelas.WAKTU"
              :style="{top: waktuToTopOffset(kelas.WAKTU)}"
            ><div class="kotak-jadwal"
                :style="{ height: waktuToHeight(kelas.WAKTU) }"
              >
                <small>{{kelas.WAKTU}}</small>
                <div><strong>{{kelas['NAMA KELAS'].replace('Kelas ', '')}}</strong></div>
                <small>{{kelas.RUANG}}</small>
              </div>
            </div>
          </div>
          <div class="baris-jam" v-for="jam in listJam" :key="jam + '-' + hari"></div>
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
  name: 'lihat-jadwal',
  props: ['namaJadwal'],
  data () {
    return {
      listHari: ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'],
      listJam: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      // need to sync manually with scss variable
      barisJamHeight: 50
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
  border-left: 1px solid $green-dark;

  &:not(:last-child) {
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
  padding: 0.2rem;
  background-color: $green-light;
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
