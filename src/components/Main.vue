<template>
  <div>
    <div v-if="initialized">
      <router-view />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapState } from 'vuex';

@Component({
  computed: {
    ...mapState({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialized: (state: any) => state.general.initialized
    })
  }
})
export default class Main extends Vue {
  loading = true;
  initialized!: boolean;
  userLoggedIn!: boolean;

  get initializedAndLoggedIn(): boolean {
    return this.initialized;
  }
}
</script>
<style></style>
