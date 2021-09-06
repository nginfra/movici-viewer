<template>
  <div class="scrollbar-elder">
    <app-navbar />
    <section class="app-main">
      <div class="columns is-flex-grow-1 is-gapless is-marginless">
        <app-sidebar />
        <div class="column">
          <div class="main is-fluid">
            <div class="column">
              <router-view />
            </div>
          </div>
        </div>
      </div>
      <app-footer />
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NavBar from './general/NavBar.vue';
import SideBar from './general/SideBar.vue';
import Footer from './general/Footer.vue';

@Component({
  components: {
    appNavbar: NavBar,
    appSidebar: SideBar,
    appFooter: Footer
  }
})
export default class Console extends Vue {}
</script>

<style lang="scss" scoped>
.scrollbar-elder {
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
