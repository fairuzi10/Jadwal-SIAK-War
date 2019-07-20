<template>
  <div>
    <b-navbar
      toggleable="lg"
      variant="light"
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
    <div class="container-fluid px-0 d-flex full-height">
      <div class="row no-gutters flex-grow-1">
        <schedule-list
          v-if="isShowingSidebar"
          class="schedule-list-sidebar-wrapper"
        />
        <div
          class="col"
        >
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
</template>

<script>
import ScheduleList from '@/components/ScheduleList'
import { WINDOW__RESIZED } from '@/store/actions.type'
import { mapGetters } from 'vuex'

export default {
  name: 'JadwalSiakWar',
  components: {
    ScheduleList
  },
  computed: {
    ...mapGetters({
      height: 'window_height',
      width: 'window_width'
    }),
    isShowingSidebar () {
      return this.width > this.breakpoint.lg
    }
  },
  created () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize () {
      this.$store.dispatch(WINDOW__RESIZED)
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

.full-height {
  min-height: 1000px;
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
