<template>
  <div class="modal-card" style="width: auto" v-if="dataset_generator">
    <header class="modal-card-head">
      <p class="modal-card-title">
        {{ $t('dataset_generator.generate_datasets_for') }} {{ dataset_generator.name }}
      </p>
    </header>
    <section class="modal-card-body">
      <div class="" v-if="orderedNonExistingDatasets.length">
        <span class="has-text-weight-bold">{{ $t('resources.datasets') }}:</span>
        <b-button
          class="mx-2"
          type="is-text"
          size="is-small"
          @click="onSelectAll(orderedNonExistingDatasets)"
        >
          {{ $t('actions.selectAll') }} </b-button
        >|
        <b-button
          class="ml-2"
          type="is-text"
          size="is-small"
          @click="onDeselectAll(orderedNonExistingDatasets)"
        >
          {{ $t('actions.deselectAll') }}
        </b-button>
        <div v-for="(dataset, index) in orderedNonExistingDatasets" v-bind:key="index">
          <b-checkbox :native-value="dataset.type" :id="dataset.type" v-model="datasets_checked">
            {{ getDatasetTypeDisplayName(dataset.type) }}
            <i>({{ dataset.name }})</i>
          </b-checkbox>
        </div>
      </div>
      <div v-if="orderedExistingDatasets.length">
        <span class="has-text-weight-bold">{{ $t('dataset_generator.existing_datasets') }}:</span>
        <b-button type="is-text" size="is-small" @click="onSelectAll(orderedExistingDatasets)">
          {{ $t('actions.selectAll') }} </b-button
        >|
        <b-button type="is-text" size="is-small" @click="onDeselectAll(orderedExistingDatasets)">
          {{ $t('actions.deselectAll') }}
        </b-button>
      </div>
      <div v-for="(dataset, index) in orderedExistingDatasets" v-bind:key="index">
        <b-checkbox :native-value="dataset.type" :id="dataset.type" v-model="datasets_checked">
          {{ getDatasetTypeDisplayName(dataset.type) }}
          <i>({{ dataset.name }})</i>
        </b-checkbox>
      </div>
      <hr />
      <div class="is-flex is-flex-direction-column">
        <span class="has-text-weight-bold mb-1">{{ $t('dataset_generator.workload.flags') }}:</span>
        <b-checkbox
          class="mb-1"
          :id="'subset_only'"
          :native-value="'subset_only'"
          v-model="flags"
          >{{ $t('dataset_generator.subset_only') }}</b-checkbox
        >
        <b-checkbox
          class="mb-1"
          :id="'force_subset'"
          :native-value="'force_subset'"
          v-model="flags"
          >{{ $t('dataset_generator.force_subset') }}</b-checkbox
        >
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">
        {{ $t('actions.cancel') }}
      </button>
      <button class="button is-primary" @click="onGenerate">
        {{ $t('dataset_generator.generate') }}
      </button>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { successMessage } from '@/snackbar';
import orderBy from 'lodash/orderBy';
import {
  Dataset,
  DatasetGenerator,
  DatasetGeneratorDataset,
  DatasetGeneratorDatasetType
} from '@/types';
import DatasetsStore from '@/store/modules/DatasetsStore';
import DatasetGeneratorsStore from '@/store/modules/DatasetGeneratorsStore';

@Component({ name: 'GenerateDialog' })
export default class GenerateDialog extends Vue {
  @Prop({ type: String }) readonly generator_uuid!: string;
  @Prop([Object]) readonly dataset_generator!: DatasetGenerator;
  datasets_checked: string[] = [];
  datasets: Dataset[] = [];
  flags = [];

  get dataset_types(): DatasetGeneratorDatasetType[] {
    return DatasetGeneratorsStore.dataset_types;
  }

  get orderedNonExistingDatasets(): DatasetGeneratorDataset[] {
    return orderBy(this.dataset_generator.datasets, 'name').filter(dataset => {
      return !this.datasetExists(dataset.name);
    });
  }

  get orderedExistingDatasets(): DatasetGeneratorDataset[] {
    return orderBy(this.dataset_generator.datasets, 'name').filter(dataset => {
      return this.datasetExists(dataset.name);
    });
  }

  async onGenerate() {
    const message = await DatasetGeneratorsStore.generate({
      generator_uuid: this.generator_uuid,
      payload: { datasets: this.datasets_checked, flags: this.flags }
    });

    successMessage(message);
    this.$emit('close');
  }

  getDatasetTypeDisplayName(dataset_type: string) {
    let matching_dataset_types = this.dataset_types.filter(dt => {
      return dt.type === dataset_type;
    });

    if (matching_dataset_types.length > 0) {
      return matching_dataset_types[0].display_name;
    }

    return '';
  }

  async getDatasets() {
    this.datasets = await DatasetsStore.getDatasets();
  }

  datasetExists(dataset_name: string) {
    return (
      this.datasets.filter(existing_dataset => {
        return existing_dataset.name === dataset_name && existing_dataset.has_data;
      }).length > 0
    );
  }

  onSelectAll(datasets: DatasetGeneratorDataset[]) {
    datasets.forEach(dataset => {
      if (!this.datasets_checked.includes(dataset.type)) {
        this.datasets_checked.push(dataset.type);
      }
    });
  }

  onDeselectAll(datasets: DatasetGeneratorDataset[]) {
    for (let i = 0; i < datasets.length; ++i) {
      for (let j = 0; j < this.datasets_checked.length; ++j) {
        if (datasets[i].type === this.datasets_checked[j]) {
          this.datasets_checked.splice(j, 1);
        }
      }
    }
  }

  async mounted() {
    await Promise.all([
      this.getDatasets(),
      DatasetGeneratorsStore.getDatasetGenerator(this.generator_uuid),
      DatasetGeneratorsStore.getDGSDatasetTypes()
    ]);

    for (let dataset of this.dataset_generator.datasets) {
      // Check if dataset already exists (then do not generate it by default)
      if (!this.datasetExists(dataset.name)) {
        this.datasets_checked.push(dataset.type);
      }
    }
  }
}
</script>
