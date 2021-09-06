<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
  name: 'App'
})
export default class App extends Vue {
  data() {
    return {};
  }
  created() {
    this.$store.dispatch('initApp').then(() => {});
  }
}
</script>
<style></style>
