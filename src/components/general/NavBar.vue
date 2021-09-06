<template>
  <nav
    class="navbar is-fixed-top has-shadow is-white"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <router-link
        class="navbar-item"
        active-class="ignore-router-link-active"
        :to="{ name: 'Home' }"
      >
        <img src="@/assets/images/movici_logo.svg" alt="MoViCI" />
      </router-link>
      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        @click="isOpen = !isOpen"
        v-bind:class="{ 'is-active': isOpen }"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" v-bind:class="{ 'is-active': isOpen }">
      <div class="navbar-start"></div>
      <div class="navbar-end">
        <div class="navbar-item">
          {{ $t('misc.welcome') }},&nbsp;
          <span class="has-text-weight-bold" style="padding-left: 0.3em">{{ fullName }}</span>
        </div>
        <router-link class="navbar-item" :to="{ name: 'Profile' }">
          {{ $t('misc.profile') }}
        </router-link>
        <router-link class="navbar-item" :to="{ name: 'Settings' }">
          {{ $t('misc.settings') }}
        </router-link>
        <a class="navbar-item" @click="logout">{{ $t('misc.logout') }}</a>
      </div>
    </div>
  </nav>
</template>
<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState({
      currentUser: state => state.currentUser.user.username
    }),
    ...mapGetters({
      fullName: 'currentUser/fullName'
    })
  },
  mounted() {
    this.$store
      .dispatch('currentUser/getCurrentUser')
      .then(() => {})
      .catch(() => {});
  },
  methods: {
    logout() {
      this.$store.dispatch('currentUser/doLogout').then(() => {
        if (this.$route.name !== 'Home') {
          this.$router.push({ name: 'Home' });
        }
      });
    }
  },
  data: function () {
    return {
      isOpen: false
    };
  }
};
</script>
<style scoped></style>
