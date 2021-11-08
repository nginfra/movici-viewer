<template>
  <div>
    <div v-if="initialized">
      <router-view />
    </div>
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

  userLoggedIn!: boolean;

  get initializedAndLoggedIn(): boolean {
    return this.initialized;
  }
}
</script>
<style></style>
