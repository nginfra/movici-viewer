<template>
  <div>
    <ul>
      <li>
        <b-checkbox :value="checkBoxSelected" @input="updateCheckBox">
          {{ display_name }}
        </b-checkbox>
        <div v-if="schema && checkBoxSelected" class="ml-5">
          <p class="has-text-weight-bold has-size-6-half mb-1">{{ $t('misc.properties') }}:</p>
          <div
            class="mb-2"
            v-for="(property_details, property_name) in schema.properties"
            v-bind:key="property_name"
          >
            <!-- boolean type -->
            <div v-if="property_details.type === 'boolean'">
              <b-checkbox
                :value="params[property_name]"
                @input="onPropertyChanged(property_name, $event)"
              >
                {{ property_details.description }}
              </b-checkbox>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <ul v-if="childs && checkBoxSelected" class="ml-5 mb-2">
      <li v-for="(child, index) in childs" v-bind:key="index">
        <span class="has-text-weight-bold">{{ child.child_type }}:</span>
        <div class="pl-0 pb-1">
          <b-button type="is-text" size="is-small" @click="onSelectAll(child.child_type)"
            >{{ $t('actions.selectAll') }}
          </b-button>
          |
          <b-button type="is-text" size="is-small" @click="onDeselectAll(child.child_type)"
            >{{ $t('actions.deselectAll') }}
          </b-button>
          <DatasetType
            v-for="(dataset_type, index) in child.dataset_types"
            v-bind:key="index"
            :type="dataset_type.type"
            :display_name="dataset_type.display_name"
            :parent_type="type"
            :child_type="child.child_type"
            :childs="dataset_type.childs"
            :schema="dataset_type.schema"
            :selected="childs.dataset_types"
            ref="child_dataset_types"
          ></DatasetType>
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator';
import { findDataset } from './helpers';
import { hasOwnProperty } from '@/utils';
import DatasetGeneratorsStore from '@/store/modules/DatasetGeneratorsStore';
import { JsonSchema } from '@/types';

@Component({
  name: 'DatasetType',
  components: {}
})
export default class DatasetType extends Vue {
  @Prop() readonly type!: string;
  @Prop({ type: String }) readonly display_name!: string;
  @Prop({ type: Object }) readonly schema!: JsonSchema;
  @Prop({ type: Array }) readonly childs!: JsonSchema[];
  @Prop({ type: String }) readonly parent_type!: string;
  @Prop({ type: String }) readonly child_type!: string;
  @Ref('child_dataset_types') readonly child_dataset_types!: DatasetType[];

  checkBoxSelected = false;
  params: Record<string, unknown> = {};

  get dataset_generator() {
    return DatasetGeneratorsStore.currentDatasetGenerator;
  }

  get generatorName() {
    return this.dataset_generator?.name;
  }

  get datasetInConfig() {
    if (this.dataset_generator?.datasets?.length) {
      for (let i = 0; i < this.dataset_generator.datasets.length; ++i) {
        let result = findDataset(this.type, this.dataset_generator.datasets[i]);
        if (result !== null) {
          return result;
        }
      }
    }

    return null;
  }

  initializeParameters() {
    const params = {};

    // Set each property to default value
    if (this.schema) {
      for (let property_name in this.schema.properties) {
        if (hasOwnProperty(this.schema.properties, property_name)) {
          let property = this.schema.properties[property_name];
          this.params[property_name] = property.default;
        }
      }
    }

    this.params = params;
  }

  getDatasetPayload() {
    return {
      type: this.type,
      display_name: this.display_name,
      name: this.type + this.getDatasetPostfix(),
      params: this.params
    };
  }

  getDatasetPostfix() {
    if (this.dataset_generator === null) {
      return '';
    }

    let postfix = '' + this.generatorName;

    // replace whitespaces, and replace non-alphanumeric characters with underscores
    // and make lowercase
    postfix = postfix.trim().replace(/[\W_]/g, '_').toLowerCase();
    return '_' + postfix;
  }

  async onPropertyChanged(property_name: string, property_value: unknown) {
    this.params[property_name] = property_value;
    await DatasetGeneratorsStore.updateGeneratorDataset(this.getDatasetPayload());
  }

  onSelectAll(child_type: string) {
    this.child_dataset_types.forEach(child_dataset_type => {
      if (child_dataset_type.child_type === child_type) {
        child_dataset_type.updateCheckBox(true);
      }
    });
  }

  onDeselectAll(child_type: string) {
    this.child_dataset_types.forEach(child_dataset_type => {
      if (child_dataset_type.child_type === child_type) {
        child_dataset_type.updateCheckBox(false);
      }
    });
  }

  updateCheckBox(selected: boolean) {
    this.checkBoxSelected = selected;
    this.syncToStore().then(() => {});
  }

  async syncToStore() {
    if (this.checkBoxSelected) {
      await DatasetGeneratorsStore.addGeneratorDataset({
        dataset: this.getDatasetPayload(),
        parent_type: this.parent_type,
        child_type: this.child_type
      });
    } else {
      await DatasetGeneratorsStore.removeGeneratorDataset(this.type);
    }
  }

  @Watch('generatorName')
  async afterGeneratorName(old_value: string, new_value: string) {
    if (old_value !== new_value && this.checkBoxSelected) {
      await DatasetGeneratorsStore.updateGeneratorDataset(this.getDatasetPayload());
    }
  }

  @Watch('datasetInConfig', { immediate: true })
  initializeState() {
    if (this.datasetInConfig) {
      this.checkBoxSelected = true;
      this.params = this.datasetInConfig.params;
    } else {
      this.checkBoxSelected = false;
      this.initializeParameters();
    }
  }
}
</script>

<style scoped></style>
