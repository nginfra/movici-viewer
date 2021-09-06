<template>
  <section>
    <h1 class="title">{{ title | upperFirst }}</h1>
    <MovProjectPicker :disabled="editMode" />
    <div v-if="dataset_generator" class="has-background-white is-fluid">
      <div class="has-padding">
        <b-tabs class="flow-tabs uppercase" v-model="activeTab">
          <b-message
            v-for="(error, index) in errors"
            type="is-danger"
            has-icon
            icon-size="is-small"
            :key="index"
            >{{ error }}</b-message
          >
          <!-- Begin editor tab -->
          <b-tab-item :label="$t('dataset_generator.editor')">
            <Configurator
              :value="dataset_generator"
              @cancel="goBack"
              @save-and-generate="onSaveAndGenerate"
              @save="validateBeforeSave"
              :addMode="addMode"
            ></Configurator>
          </b-tab-item>
          <!-- End editor tab -->

          <!-- Begin raw config tab -->
          <b-tab-item :label="$t('dataset_generator.rawConfig')">
            <RawConfig
              :value="dataset_generator"
              :label="$t('dataset_generator.config')"
              @save="validateBeforeSave"
              @error="addErrors"
              @cancel="goBack"
            ></RawConfig>
          </b-tab-item>
          <!-- End raw config tab -->

          <!-- Begin activity log tab -->
          <b-tab-item
            :label="$t('dataset_generator.logs')"
            :disabled="activityLogsDisabled(dataset_generator)"
            :visible="!addMode"
          >
            <ActivityLog :generator_uuid="uuid" />
          </b-tab-item>
          <!-- End activity log tab -->
        </b-tabs>
      </div>
    </div>
    <div v-else>
      <p>{{ $t('dataset_generator.invalid') }}</p>
    </div>
  </section>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import RawConfig from '@/components/global/RawConfig.vue';
import Configurator from './Configurator.vue';
import ActivityLog from './ActivityLog.vue';
import { EventBus } from '../../eventbus';
import { successMessage } from '../../snackbar';
import ProjectStore from '@/store/modules/ProjectStore';
import DatasetGeneratorsStore from '@/store/modules/DatasetGeneratorsStore';
import { DatasetGenerator, UUID } from '@/types';

const TabIds = ['editor', 'config', 'logs'];

@Component({
  name: 'DatasetGeneratorDetail',
  components: {
    RawConfig,
    Configurator,
    ActivityLog
  }
})
export default class DatasetGeneratorDetail extends Vue {
  @Prop({ type: String }) readonly uuid!: UUID;
  @Prop({ type: String }) requested_tab!: string;
  activeTab = 0;
  errors: string[] = [];

  get project() {
    return ProjectStore.projects;
  }

  get dataset_generator() {
    return DatasetGeneratorsStore.currentDatasetGenerator;
  }

  get addMode() {
    return !this.uuid;
  }

  get editMode() {
    return !!this.uuid;
  }

  get title() {
    return this.addMode ? this.$t('dataset_generator.addNew') : this.$t('dataset_generator.edit');
  }

  get activeTabId() {
    return TabIds[this.activeTab];
  }

  async initializeThisDatasetGenerator() {
    if (this.editMode) {
      await DatasetGeneratorsStore.getDatasetGenerator(this.uuid);
    } else {
      await DatasetGeneratorsStore.setCurrentDatasetGenerator(
        this.getEmptyDatasetGenerator() as DatasetGenerator
      );
    }
  }

  getEmptyDatasetGenerator(): Partial<DatasetGenerator> {
    return {
      name: '',
      datasets: [],
      polygon: undefined
    };
  }

  async validateBeforeSave(value: DatasetGenerator) {
    if (this.editMode) {
      await this.updateDatasetGenerator(value);
      successMessage('Dataset Generator successfully updated');
    } else {
      await this.addDatasetGenerator(value, false);
      successMessage('Dataset Generator successfully created');
    }
    this.goBack();
  }

  async onSaveAndGenerate(value: DatasetGenerator) {
    if (this.editMode) {
      await this.updateDatasetGenerator(value);
      successMessage('Dataset Generator successfully updated');
    } else {
      await this.addDatasetGenerator(value, true);
      successMessage('Dataset Generator successfully created');
    }

    this.goBack();
  }

  async updateDatasetGenerator(value: DatasetGenerator) {
    return await DatasetGeneratorsStore.updateDatasetGenerator(value);
  }

  async addDatasetGenerator(value: DatasetGenerator, start_generation: boolean) {
    const resp = await DatasetGeneratorsStore.addNewDatasetGenerator(value);
    if (resp?.generator_uuid) {
      if (start_generation) {
        // Also generate datasets directly
        await this.generate(resp.generator_uuid);
      }
    }
  }

  async generate(generator_uuid: string) {
    const message = await DatasetGeneratorsStore.generate({
      generator_uuid: generator_uuid,
      payload: {}
    });
    successMessage(message);
  }

  goBack() {
    this.$router.push({ name: 'DatasetGenerators' });
  }

  addErrors(errors: string[]) {
    if (Array.isArray(errors)) {
      this.errors = errors;
    } else if (typeof errors === 'string') {
      this.errors = [errors];
    } else {
      console.log('invalid error', errors);
    }
  }

  activityLogsDisabled(generator: DatasetGenerator) {
    return generator.last_workload_status === null;
  }

  mounted() {
    this.initializeThisDatasetGenerator();

    if (this.requested_tab) {
      this.activeTab = TabIds.indexOf(this.requested_tab);
    }
  }

  @Watch('activeTab')
  afterActiveTab() {
    this.errors = [];
    EventBus.$emit('dataset-generators-active-tab', this.activeTabId);
  }

  @Watch('projects')
  afterProjects() {
    if (this.dataset_generator && this.dataset_generator.project_name) {
      ProjectStore.setActiveProjectName(this.dataset_generator.project_name);
    }
  }
}
</script>
<style scoped></style>
