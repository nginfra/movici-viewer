<template>
  <b-field :label="$t('resources.scenario')" :class="size">
    <b-select
      :value="uuid"
      @input="input"
      :placeholder="$t('scenario.select')"
      :disabled="disabled"
      :size="size"
      type="is-danger"
    >
      <option v-for="scenario in scenarios" :value="scenario.uuid" :key="scenario.uuid">
        {{ scenario.display_name }}
      </option>
    </b-select>
  </b-field>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ShortScenario, UUID } from '@/types';

// TODO: make this a generic picker
@Component({
  name: 'ScenarioPicker'
})
export default class ScenarioPicker extends Vue {
  @Prop({ type: Object }) value!: ShortScenario;
  @Prop({ type: Boolean, default: false }) disabled!: boolean;
  @Prop({ type: String, default: '' }) size!: string;
  @Prop({ type: Array, default: () => [] }) scenarios!: ShortScenario[];

  get uuid() {
    return this.value?.uuid ?? null;
  }

  input(uuid: UUID) {
    const rv = this.scenarios.find(s => s.uuid === uuid);
    this.$emit('input', rv);
  }
}
</script>
<style scoped></style>
