<template>
  <section>
    <FlowContainer class="flow-settings">
      <template #leftPanel>
        <div class="has-background-white is-fluid has-padding">
          <MovLanguagePicker v-model="language" has-label />
        </div>
      </template>
    </FlowContainer>
  </section>
</template>
<script lang="ts">
import { generalStore } from '@/store';
import { Vue, Component } from 'vue-property-decorator';
import { MovLanguagePicker } from '@movici-flow-common/components';

@Component({
  components: { MovLanguagePicker }
})
export default class Settings extends Vue {
  get language(): string {
    return generalStore.language;
  }

  set language(newValue: string) {
    generalStore.setLanguage(newValue);
  }
}
</script>
<style scoped></style>
