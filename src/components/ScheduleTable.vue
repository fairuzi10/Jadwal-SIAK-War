<template>
  <div>
    <div class="d-flex mb-2">
      <div id="time-col">
        <div
          v-for="time in timeList"
          :key="time + 'time-row'"
          class="time-marker-row"
        >
          <strong>{{ time + '.00' }}</strong>
        </div>
      </div>
      <div
        id="col-wrapper"
        class="d-flex"
      >
        <div
          v-for="day in dayList"
          :key="day"
          class="day-col"
        >
          <span class="day">{{ capitalize(day) }}</span>
          <div class="anchor">
            <div
              v-for="classInstance in chosenClassGroupedByDay[day]"
              :key="classInstance.RUANG + '-' + classInstance.WAKTU"
              class="schedule-box-anchor"
              :style="{top: timeToTopOffset(classInstance.WAKTU)}"
            >
              <div
                class="schedule-box"
                :style="{ height: timeToHeight(classInstance.WAKTU) }"
              >
                {{ classInstance.WAKTU }}
                <div><strong>{{ simplifyClassName(classInstance['NAMA KELAS']) }}</strong></div>
                {{ classInstance.RUANG }}
              </div>
            </div>
          </div>
          <div
            v-for="time in timeList.slice(0, timeList.length - 1)"
            :key="time + '-' + day"
            class="time-row"
          />
        </div>
      </div>
    </div>
    <div
      v-for="classInstance in specialClass"
      :key="classInstance['NAMA KELAS']"
    >
      <strong>{{ '+ ' + simplifyClassName(classInstance['NAMA KELAS']) }}</strong>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScheduleTable',
  props: {
    chosenClass: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // need to sync manually with scss variable
      timeRowHeight: 50
    }
  },
  computed: {
    classWithTime () {
      const filteredKey = Object.keys(this.chosenClass).filter(key => this.chosenClass[key] && this.chosenClass[key].WAKTU)
      return filteredKey.reduce((acc, key) => ({ ...acc, [key]: this.chosenClass[key] }), {})
    },
    specialClass () {
      const filteredKey = Object.keys(this.chosenClass).filter(key => this.chosenClass[key] && !this.chosenClass[key].WAKTU)
      return filteredKey.reduce((acc, key) => ({ ...acc, [key]: this.chosenClass[key] }), {})
    },
    chosenClassGroupedByDay () {
      const initObject = this.dayList.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
      return Object.keys(this.classWithTime).reduce((acc, key) => {
        if (!this.classWithTime[key]) {
          return acc
        } else {
          const result = acc
          const classInstance = this.classWithTime[key]
          // corner case, different time period (month or sth) but same schedule
          const filtered = classInstance.WAKTU.map((time, idx) => {
            for (let i = 0; i < idx; i++) {
              if (time === classInstance.WAKTU[i]) {
                return false
              }
            }
            return true
          })
          const time = classInstance.WAKTU.filter((time, idx) => filtered[idx])
          const room = classInstance.RUANG.filter((room, idx) => filtered[idx])

          time.forEach((daytime, idx) => {
            const splitted = daytime.split(', ')
            const day = splitted[0].toLowerCase()
            const time = splitted[1]

            result[day].push({
              'NAMA KELAS': classInstance['NAMA KELAS'],
              'RUANG': room[idx],
              'WAKTU': time
            })
          })
          return result
        }
      }, initObject)
    },
    dayList () {
      const result = ['senin', 'selasa', 'rabu', 'kamis', 'jumat']
      let sabtuExist = false
      Object.keys(this.classWithTime).forEach(key => {
        if (this.classWithTime[key]) {
          const clas = this.classWithTime[key]
          clas.WAKTU.forEach((daytime, idx) => {
            const day = daytime.split(', ')[0]
            if (day.toLowerCase() === 'sabtu') {
              sabtuExist = true
            }
          })
        }
      })
      if (sabtuExist) result.append('sabtu')
      return result
    },
    timeList () {
      let min = 24
      let max = 0
      Object.keys(this.classWithTime).forEach(key => {
        if (this.classWithTime[key]) {
          const clas = this.classWithTime[key]
          clas.WAKTU.forEach((daytime, idx) => {
            const time = daytime.split(', ')[1]
            const jamAwal = Number(time.substr(0, 2))
            const jamAkhir = Number(time.substr(6, 2)) + 1
            min = Math.min(min, jamAwal)
            max = Math.max(max, jamAkhir)
          })
        }
      })
      return this.generateList(min, max)
    }
  },
  methods: {
    timeInHour (time) {
      const hour = Number(time.substr(0, 2))
      const minute = Number(time.substr(3, 2))
      return hour + minute / 60
    },
    timeToTopOffset (time) {
      // start from time 8
      return `${(this.timeInHour(time) - this.timeList[0]) * this.timeRowHeight}px`
    },
    timeToHeight (time) {
      const startTime = time.substr(0, 5)
      const endTime = time.substr(6, 5)
      const duration = this.timeInHour(endTime) - this.timeInHour(startTime)
      return `${duration * this.timeRowHeight}px`
    },
    generateList (from, to) {
      const result = []
      for (let i = from; i <= to; i++) {
        result.push(i)
      }
      return result
    },
    simplifyClassName (className) {
      return className.replace('Kelas ', '')
    }
  }
}
</script>

<style lang="scss" scoped>
$time-row-height: 50px;

.day-col {
  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%;
  text-align: center;
}

.time-row {
  height: $time-row-height;

  &:nth-child(3) {
    border-top: 1px dashed $dark;
  }

  border-left: 1px solid $dark;
  border-bottom: 1px dashed $dark;

}

.time-marker-row {
  &:not(:last-child) {
    height: $time-row-height;
  }
}

#col-wrapper {
  flex-grow: 1;
  max-width: 100%;
}

.anchor {
  position: relative;
}

.schedule-box-anchor {
  position: absolute;
  width: 100%;
  padding: 0 0.1rem 0 0.2rem;
}

.day {
  font-size: 0.8rem;
  @include sm {
    font-size: 0.9rem;
  }
  @include md {
    font-size: 1rem;
  }
}

#time-col {
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

.schedule-box {
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
