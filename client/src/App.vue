<template>
  <div id="app">
    <div v-if="initialized">
      <router-view />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { generalStore } from './store';

@Component({
  name: 'App'
})
export default class App extends Vue {
  get initialized() {
    return generalStore.initialized;
  }
  async mounted() {
    await generalStore.initApp();
  }
}
</script>
<style></style>
