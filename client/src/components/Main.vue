<template>
  <div>
    <router-view />
  </div>
</template>
<script lang="ts">
import { generalStore } from '../store';
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class Main extends Vue {
  loading = true;

  get initialized() {
    return generalStore.initialized;
  }
}
</script>
<style></style>
