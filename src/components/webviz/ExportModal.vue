<template>
  <Modal title="Export dataset" :active="active" @close="$emit('close')">
    <template v-slot:content>
      <b-field
        label="Dataset"
        :type="{ 'is-danger': errors['currentDatasetName'] }"
        :message="errors['currentDatasetName'] || ''"
      >
        <b-select
          expanded
          :placeholder="$t('dataset.select')"
          :value="currentDatasetName"
          @input="validated('currentDatasetName', $event)"
        >
          <option v-for="dataset in datasets" :value="dataset.name" :key="dataset.name">
            {{ dataset.display_name }}
          </option>
        </b-select>
      </b-field>

      <b-field
        label="Entity group"
        :type="{ 'is-danger': errors['currentEntityName'] }"
        :message="errors['currentEntityName'] || ''"
        v-if="entityGroups || currentEntityName"
      >
        <b-select
          expanded
          :placeholder="$t('entityGroup.select')"
          :value="currentEntityName"
          @input="validated('currentEntityName', $event)"
        >
          <option v-for="entity in entityGroups" :value="entity.name" :key="entity.name">
            {{ entity.name }} ({{ entity.count }})
          </option>
        </b-select>
      </b-field>
      <b-field :label="$t('timeline.timestamp')" v-if="timelineInfo">
        <TimeSlider v-model="currentTimestamp" :timeline-info="timelineInfo"></TimeSlider>
      </b-field>
      <BLoading :active="loading" :is-full-page="false"></BLoading>
    </template>
    <template v-slot:footer>
      <button id="save-btn" class="button is-primary" @click="exportAndClose">
        {{ $t('actions.exportCSV') }}
      </button>
    </template>
  </Modal>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import Modal from '@/components/general/Modal.vue';
import {
  Dataset,
  EntityGroupData,
  ScenarioDataset,
  TimeOrientedSimulationInfo,
  VisualizationMode
} from '@/types';
import FormValidator from '@/utils/FormValidator';
import ValidationProvider from '@/components/mixins/ValidationProvider';
import SummaryListing from '@/components/webviz/SummaryListing';
import TimeSlider from '@/components/webviz/TimeSlider.vue';
import { DatasetDownloader } from '@/api/DatasetDownloader';
import { entityGroupToCSV, objectToCSV } from '@/utils/csvUtils';
import { downloadAsFile } from '@/store/requests';
import { webvizStore } from '@/store/store';

@Component({
  name: 'ExportModal',
  components: { Modal, TimeSlider }
})
export default class ExportModal extends Mixins(SummaryListing, ValidationProvider) {
  @Prop({ type: Boolean, default: false }) readonly active!: boolean;
  @Prop({ type: Number, default: 0 }) readonly timestamp!: number;
  @Prop({ type: Object, default: null }) readonly timelineInfo!: TimeOrientedSimulationInfo | null;
  @Prop({ type: String, default: null }) readonly scenarioUuid!: string | null;
  @Prop({ type: String, default: null }) readonly datasetName!: string | null;
  @Prop({ type: String, default: null }) readonly entityName!: string | null;

  currentTimestamp = 0;
  validator: FormValidator | null = null;
  loading = false;

  get unixTime(): number | null {
    return this.timelineInfo
      ? (this.timestamp * this.timelineInfo.time_scale + this.timelineInfo.reference_time) * 1000
      : null;
  }
  get currentFormattedTime(): string {
    return this.unixTime ? new Date(this.unixTime).toLocaleString('NL-nl') : '-';
  }

  get fileNameTime(): string {
    const leadingZero = (val: number): string => ('0' + val).slice(-2);
    if (!this.unixTime) return '-';
    const date = new Date(this.unixTime);
    return [
      date.getFullYear(),
      leadingZero(date.getMonth() + 1),
      leadingZero(date.getDate()),
      '-',
      leadingZero(date.getHours()),
      leadingZero(date.getMinutes()),
      leadingZero(date.getSeconds())
    ].join('');
  }

  get currentDataset(): Dataset | ScenarioDataset | null {
    return this.currentDatasetName ? this.datasetsByName[this.currentDatasetName] : null;
  }

  setupValidator() {
    this.validator = new FormValidator({
      validators: {
        currentDatasetName: () => {
          if (!this.currentDatasetName) {
            return 'Please select a dataset';
          }
        },
        currentEntityName: () => {
          if (!this.currentEntityName) {
            return 'Please select an entity group';
          }
        }
      },
      onValidate: e => {
        this.errors = e;
      }
    });
  }

  reset() {
    this.currentDatasetName = null;
    this.currentEntityName = null;
    this.errors = {};
    this.loading = false;
  }

  exportAndClose() {
    this.validator?.validate();
    if (this.hasErrors) return;

    this.exportData().then(() => {
      this.loading = false;
      this.$emit('close');
    });
  }

  async exportData() {
    this.loading = true;
    if (this.currentDatasetUUID && this.currentEntityName) {
      const store = new DatasetDownloader({
        client: this.$store.getters.api,
        datasetUUID: this.currentDatasetUUID,
        scenarioUUID: this.scenarioUuid || undefined
      });
      const data = await store.getDatasetState<EntityGroupData<unknown>>({
        entityGroup: this.currentEntityName,
        timestamp: this.currentTimestamp
      });
      const csvData = entityGroupToCSV(data);
      downloadAsFile(
        new Blob([this.generalDataHeader(), csvData], { type: 'text/csv' }),
        this.fileName()
      );
    }
  }
  fileName(): string {
    let rv = this.currentDatasetName ?? 'unknown_dataset';
    if (this.currentEntityName) {
      rv += '-' + this.currentEntityName;
    }
    if (webvizStore.settings?.mode == VisualizationMode.SCENARIO) {
      rv += '-' + this.fileNameTime;
    }
    return rv + '.csv';
  }
  generalDataHeader(): string {
    const obj: Record<string, unknown> = {
      project: webvizStore.settings?.project.display_name,
      dataset: this.currentDataset?.display_name ?? this.currentDataset?.name ?? '-'
    };
    if (webvizStore.settings?.mode == VisualizationMode.SCENARIO) {
      obj.scenario =
        webvizStore.settings?.scenario?.display_name ?? webvizStore.settings?.scenario?.name ?? '-';
      obj.timestamp = this.currentFormattedTime;
    }
    return objectToCSV(obj);
  }
  @Watch('active')
  onActive() {
    if (this.active) {
      this.initialize().then(() => {});
    } else {
      this.reset();
    }
  }

  async initialize() {
    if (this.datasetName) {
      this.currentDatasetName = this.datasetName;
    }

    if (this.entityName) {
      this.currentEntityName = this.entityName;
    }

    this.currentTimestamp = this.timestamp;
    await this.getAvailableDatasets();
    await this.getSummary(this.currentDatasetName);
  }

  async mounted() {
    this.setupValidator();
    await this.initialize();
  }
}
</script>

<style scoped></style>
