<template>
  <div>
    <div v-if="initialized">
      <div v-if="userLoggedIn">
        <div v-if="loading">
          <b-loading active></b-loading>
        </div>
        <div v-else>
          <router-view />
        </div>
      </div>
      <div v-else>
        <app-login></app-login>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { mapState } from 'vuex';
import NavBar from './general/NavBar.vue';
import SideBar from './general/SideBar.vue';
import Footer from './general/Footer.vue';
import Login from './account/Login.vue';

@Component({
  components: {
    appNavbar: NavBar,
    appSidebar: SideBar,
    appFooter: Footer,
    appLogin: Login
  },
  computed: {
    ...mapState({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialized: (state: any) => state.general.initialized,

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      userLoggedIn: (state: any) => state.currentUser.isLoggedIn
    })
  }
})
export default class Main extends Vue {
  loading = true;
  initialized!: boolean;
  userLoggedIn!: boolean;

  get initializedAndLoggedIn(): boolean {
    return this.initialized && this.userLoggedIn;
  }

  @Watch('initializedAndLoggedIn')
  onLoggedIn() {
    if (this.initializedAndLoggedIn) {
      this.loading = true;
      let promises = [
        this.$store.dispatch('projects/initProjects').catch(err => console.error(err)),
        this.$store.dispatch('currentUser/getCurrentUser').catch(err => console.error(err))
      ];
      Promise.all(promises).then(() => (this.loading = false));
    }
  }
}
</script>
<style></style>
