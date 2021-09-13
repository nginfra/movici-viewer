<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { generalStore } from '@/store/store';

@Component({
  name: 'App'
})
export default class App extends Vue {
  async mounted() {
    await generalStore.initApp();
  }
}
</script>
<style></style>
