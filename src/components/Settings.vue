<template>
  <section>
    <h1 class="title">{{ $t('misc.settings') }}</h1>
    <div class="has-background-white is-fluid has-padding">
      <MovLanguagePicker with-label />
    </div>
  </section>
</template>
<script lang="ts">
import { generalStore } from '@/store/store-accessor';
import { Vue, Component } from 'vue-property-decorator';
@Component
class Settings extends Vue {
  languages = ['en', 'nl'];

  get language(): string {
    return generalStore.language;
  }

  set language(newValue: string) {
    generalStore.setLanguage(newValue);
  }
}

export default Settings;
</script>
<style scoped></style>
