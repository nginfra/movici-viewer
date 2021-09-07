<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import GeneralStore from '@/store/modules/GeneralStore';

@Component({
  name: 'App'
})
export default class App extends Vue {
  data() {
    return {};
  }

  async created() {
    await GeneralStore.initApp();
  }
}
</script>
<style></style>
