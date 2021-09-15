<template>
  <b-field :label="label">
    <b-select v-model="language">
      <option v-for="(lang, i) in languages" :key="`Lang${i}`" :value="lang">{{ lang }}</option>
    </b-select>
  </b-field>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import upperFirst from 'lodash/upperFirst';
import { generalStore } from '@/store';

@Component({ name: 'LanguagePicker' })
export default class LanguagePicker extends Vue {
  @Prop({ type: Boolean, default: false }) withLabel!: boolean;
  languages = ['en', 'nl'];

  get language() {
    return generalStore.language;
  }

  set language(newValue) {
    generalStore.setLanguage(newValue);
  }

  get label() {
    if (this.withLabel) {
      return upperFirst('' + this.$t('settings.selectLanguage'));
    }
    return '';
  }
}
</script>

<style scoped></style>
