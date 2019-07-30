<template>
  <div id="app">
    <b-navbar
      toggleable="true"
      variant="light"
      fixed="top"
    >
      <router-link :to="{name: 'home'}">
        <b-navbar-brand class="text-decoration-none">
          <div id="navbar-logo">
            Jadwal SIAK War
          </div>
        </b-navbar-brand>
      </router-link>
      <template v-if="!isShowingSidebar">
        <b-navbar-toggle target="nav-collapse" />
        <b-collapse
          id="nav-collapse"
          class="schedule-list-navbar-wrapper"
          is-nav
        >
          <schedule-list />
        </b-collapse>
      </template>
    </b-navbar>
    <div class="container-fluid px-0">
      <div class="row no-gutters">
        <schedule-list
          v-if="isShowingSidebar"
          class="schedule-list-sidebar-wrapper padding-offset-navbar"
        />
        <div
          class="col desktop-full-height padding-offset-navbar"
        >
          <div class="pt-3">
            <transition
              name="fade"
              mode="out-in"
            >
              <router-view :key="$route.fullPath" />
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ScheduleList from '@/components/ScheduleList'
import {
  WINDOW__RESIZED,
  SCHEDULE_LIST__LOAD_SCHEDULE_LIST_FROM_STORAGE,
  CREATE_SCHEDULE__LOAD_MAJOR_FROM_STORAGE,
  CREATE_SCHEDULE__LOAD_SUGGESTED_SCHEDULE_NAME_FROM_STORAGE
} from '@/store/actions.type'
import { mapState } from 'vuex'
import { getItem, setItem, setObjectOrArray } from '@/helper/storage'
import { LAST_SESSION, SCHEDULE_LIST, SUGGESTED_SCHEDULE_NAME, LAST_SELECTED_MAJOR } from '@/helper/storage.type'

export default {
  name: 'JadwalSiakWar',
  metaInfo: {
    title: 'Jadwal SIAK War',
    meta: [
      { name: 'og:title', content: 'Jadwal SIAK War' },
      { name: 'description', content: 'Susun jadwal SIAK war-mu dan menangkan SIAK war!' },
      { name: 'og:description', content: 'Susun jadwal SIAK war-mu dan menangkan SIAK war!' },
      { name: 'og:image', content: require(`@/assets/logo-small.png`) }
    ]
  },
  components: {
    ScheduleList
  },
  computed: {
    ...mapState({
      height: state => state.window.height,
      width: state => state.window.width
    }),
    isShowingSidebar () {
      return this.width > this.breakpoint.lg
    }
  },
  async created () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()

    const CURRENT_SESSION = '2019/2020-1'
    if (getItem(LAST_SESSION) !== CURRENT_SESSION) {
      setObjectOrArray(SCHEDULE_LIST, [])
      setItem(LAST_SELECTED_MAJOR, null)
      setItem(SUGGESTED_SCHEDULE_NAME, 'Plan A')
      setItem(LAST_SESSION, CURRENT_SESSION)
    } else {
      await Promise.all([
        this.$store.dispatch(SCHEDULE_LIST__LOAD_SCHEDULE_LIST_FROM_STORAGE),
        this.$store.dispatch(CREATE_SCHEDULE__LOAD_MAJOR_FROM_STORAGE),
        this.$store.dispatch(CREATE_SCHEDULE__LOAD_SUGGESTED_SCHEDULE_NAME_FROM_STORAGE)
      ])
    }
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    async handleResize () {
      await this.$store.dispatch(WINDOW__RESIZED)
    }
  }
}
</script>

<style lang="scss" scoped>
body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $dark;
}

.padding-offset-navbar {
  padding-top: 100px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .15s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

#navbar-logo {
  background-image: $gradient-yellow;
  padding: 0.25rem 1rem;
  color: $dark;
  font-weight: bold;
  border-radius: 1rem;

  &:hover {
    text-decoration: none;
  }
}

.navbar {
  z-index: 1;
  box-shadow: 0px 10px 20px -10px rgba(0,64,128,0.2);
}

.desktop-full-height {
  padding-bottom: 3rem;

  @include lg {
    min-height: 1000px;
  }
}

.schedule-list-navbar-wrapper {
  margin-top: 8px;
  margin-bottom: -8px;
  margin-left: -16px;
  margin-right: -16px;
}
.schedule-list-sidebar-wrapper {
  width: 16rem;
}
</style>
