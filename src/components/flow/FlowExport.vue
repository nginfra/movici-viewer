<template>
  <div class="has-background-white p-4">
    <div class="is-flex is-flex is-align-items-center mb-3">
      <h1 class="is-size-6 has-text-black text-ellipsis">
        {{ $t('flow.export.modalTitle') }} {{ currentScenario.display_name }}
      </h1>
    </div>
    <div class="columns mt-2">
      <div class="column is-one-third">
        <label class="label is-size-7">{{ $t('flow.export.filterData') }}</label>
        <ExportLayerPicker :layers="visualizers" @selectLayer="selectedCVI = $event" />
      </div>
      <div class="column">
        <div v-if="currentScenario">
          <ExportForm
            :value="selectedCVI"
            :validator="validator"
            :scenario-uuid="currentScenario.uuid"
            :timestamp="timestamp"
            :timeline-info="timelineInfo"
            @exportConfig="exportConfig = $event"
          />
        </div>
      </div>
    </div>
    <div class="bottom is-pulled-right">
      <b-button
        size="is-small"
        icon-pack="far"
        class="mr-2 has-text-weight-bold"
        @click="$emit('close')"
      >
        {{ $t('actions.cancel') }}
      </b-button>
      <b-button
        size="is-small"
        icon-pack="far"
        class="is-primary has-text-weight-bold"
        @click="exportData"
      >
        {{ $t('flow.export.label') }}
      </b-button>
    </div>
    <div class="is-clearfix"></div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import { TimeOrientedSimulationInfo } from '@/types';
import FlowContainer from './FlowContainer.vue';
import FlowStore from '@/store/modules/FlowStore';
import FlowLayerPicker from '@/components/flow/widgets/FlowLayerPicker.vue';
import ProjectInfoBox from './info_box/ProjectInfoBox.vue';
import ScenarioInfoBox from './info_box/ScenarioInfoBox.vue';
import ExportForm from '@/components/flow/export/ExportForm.vue';
import ExportLayerPicker from '@/components/flow/export/ExportLayerPicker.vue';
import { ComposableVisualizerInfo } from '@/visualizers/VisualizerInfo';
import ValidationProvider from '../mixins/ValidationProvider';
import FormValidator from '@/utils/FormValidator';

@Component({
  components: {
    FlowLayerPicker,
    FlowContainer,
    ProjectInfoBox,
    ScenarioInfoBox,
    ExportForm,
    ExportLayerPicker
  }
})
export default class FlowExport extends Mixins(ValidationProvider) {
  @Prop({ type: Object, default: null }) readonly value!: ComposableVisualizerInfo | null;
  selectedCVI: ComposableVisualizerInfo | null = null;
  exportConfig: { datasetName: string; entityGroup: string; timestamp: number } | null = null;
  validator: FormValidator | null = null;

  // mapVis vars
  get visualizers() {
    return FlowStore.visualizers;
  }

  get currentScenario() {
    return FlowStore.scenario;
  }

  get timestamp() {
    return FlowStore.timestamp;
  }

  // Map Vis getters
  get timelineInfo(): TimeOrientedSimulationInfo | null {
    return FlowStore.timelineInfo;
  }

  async exportData() {
    this.validator?.validate();

    if (this.hasErrors) {
      return;
    }

    if (this.exportConfig) {
      await FlowStore.exportFromConfig(this.exportConfig);
    }
  }

  @Watch('value', { immediate: true })
  setValueAsSelected(value: ComposableVisualizerInfo | null) {
    this.selectedCVI = value;
  }

  setupValidator() {
    this.validator = new FormValidator();
  }

  mounted() {
    this.setupValidator();
  }
}
</script>

<style scoped lang="scss">
::v-deep {
  .group-picker .header .label {
    max-width: 200px;
  }
  .label {
    color: $black !important;
  }
}
</style>
