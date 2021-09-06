<template>
  <div class="has-background-white is-fluid">
    <!-- Save, cancel bar -->
    <div class="is-pulled-right mb-4">
      <b-button @click="$emit('cancel')">{{ $t('actions.cancel') }}</b-button>
      <b-button class="ml-2" type="is-primary" @click="$emit('save')">{{
        $t('actions.save')
      }}</b-button>
      <b-button class="ml-2" v-if="addMode" type="is-primary" @click="$emit('save-and-generate')">
        {{ $t('actions.saveAndGenerate') }}
      </b-button>
    </div>
    <div class="is-clearfix"></div>
    <!-- End save, cancel bar -->

    <!-- General properties of the dataset generator -->
    <div class="is-divider" :data-content="$t('dataset_generator.general')"></div>
    <b-field :label="$t('properties.name')" expanded>
      <b-input v-model="value.name"></b-input>
    </b-field>
    <!-- End general properties of the dataset generator -->
    <div class="columns is-centered">
      <!-- Map -->
      <div class="column is-three-quarters">
        <div class="is-divider" :data-content="$t('dataset_generator.polygon')"></div>
        <OLMap :allowDraw="true" :polygon="polygon" @polygon-changed="onPolygonChanged" />
      </div>
      <!-- End map -->

      <!-- List of dataset types -->
      <div class="column is-one-quarter">
        <div class="is-divider" :data-content="$t('dataset_generator.dataset_types')"></div>
        <nav class="overflow">
          <DatasetType
            v-for="(dataset_type, index) in orderedDatasets"
            v-bind:key="index"
            :type="dataset_type.type"
            :display_name="dataset_type.display_name"
            :childs="dataset_type.childs"
            :schema="dataset_type.schema"
          />
        </nav>
      </div>
    </div>
    <!-- End list of dataset types -->
    <div class="columns">
      <div class="column">
        <b-field grouped position="is-left">
          <b-upload v-model="polygonFile">
            <span class="button">
              <b-icon icon="upload" size="is-small"></b-icon>
              <span>{{ $t('dataset_generator.uploadPolygon') }}</span>
            </span>
          </b-upload>
        </b-field>
      </div>
    </div>
    <!-- Save, cancel bar -->
    <div class="is-pulled-right">
      <b-button @click="$emit('cancel')">{{ $t('actions.cancel') }}</b-button>
      <b-button class="ml-2" type="is-primary" @click="$emit('save')">{{
        $t('actions.save')
      }}</b-button>
      <b-button class="ml-2" v-if="addMode" type="is-primary" @click="$emit('save-and-generate')">
        {{ $t('actions.saveAndGenerate') }}
      </b-button>
    </div>
    <div class="is-clearfix"></div>
    <!-- End save, cancel bar -->
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import DatasetType from './DatasetType.vue';
import OLMap from './OLMap.vue';
import orderBy from 'lodash/orderBy';
import { failMessage } from '@/snackbar';
import DatasetGeneratorsStore from '@/store/modules/DatasetGeneratorsStore';
import { DatasetGenerator, GeoJSONPolygon } from '@/types';
import { validateGeoJSON, transformGeoJSON } from './helpers';

@Component({
  name: 'Configurator',
  components: {
    DatasetType,
    OLMap
  }
})
export default class Configurator extends Vue {
  @Prop([Object]) value!: DatasetGenerator;
  @Prop([Object]) polygonFile!: File;
  @Prop({ type: Boolean }) addMode!: boolean;

  get dataset_types() {
    return DatasetGeneratorsStore.dataset_types;
  }

  get polygon() {
    return this.value?.polygon;
  }

  get orderedDatasets() {
    return orderBy(this.dataset_types, 'display_name');
  }

  async getDatasetTypes() {
    await DatasetGeneratorsStore.getDGSDatasetTypes();
  }

  async onPolygonChanged(polygon: GeoJSONPolygon) {
    if (polygon) {
      // Polygon changed, update in store
      await DatasetGeneratorsStore.setCurrentDatasetGeneratorPolygon(polygon);
    }
  }

  @Watch('polygonFile')
  afterPolygonFile(file: File) {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', event => {
      const textData = '' + event.target?.result;
      if (!validateGeoJSON(textData)) {
        return;
      }

      let transformed = transformGeoJSON(JSON.parse(textData));
      if (transformed) {
        this.onPolygonChanged(transformed);
      }
    });

    reader.addEventListener('error', () => {
      failMessage('Could not read selected file');
    });

    reader.readAsText(file);
  }

  mounted() {
    this.getDatasetTypes();
  }
}
</script>
<style scoped lang="scss">
nav ul {
  height: 500px;
  width: 100%;
}
.is-divider {
  margin: 2rem 0 2rem;
}
</style>
