<template>
  <Modal title="Edit Layer" :active="active" @close="$emit('close')" :can-cancel="['x', 'escape']">
    <template v-slot:content>
      <div class="columns edit-layer-modal">
        <div class="column">
          <b-field label="Layer name">
            <b-input v-model="local.name" placeholder="choose a layer name" />
          </b-field>
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
          <b-checkbox v-model="local.visible">Visible</b-checkbox>
        </div>
        <div class="column">
          <GeometrySelector
            v-if="currentEntityName && entitySummary"
            v-model="geometry"
            :properties="properties"
            :value="geometry"
            label="Geometry"
            @input="validated('geometry', $event)"
          />
          <template v-if="geometry">
            <b-field
              label="Layer type"
              :message="errors['selectedLayerKind'] || ''"
              :type="{ 'is-danger': errors['selectedLayerKind'] }"
            >
              <b-select :value="selectedLayerKind" @input="validated('selectedLayerKind', $event)">
                <option
                  v-for="configurator in layerConfigurators"
                  :value="configurator.name"
                  :key="configurator.name"
                >
                  {{ configurator.display_name }}
                </option>
              </b-select>
            </b-field>
            <component
              :is="selectedLayerConfigurator"
              v-model="layerSettings"
              :value="layerSettings"
              @input="validated('layerSettings', $event)"
              :validator="validator"
              :kind="selectedLayerKind"
              :info="partialInfo"
              :properties="properties"
            />
          </template>
          <template v-else-if="currentEntityName">
            <p>Cannot visualize {{ currentEntityName }} :(</p>
          </template>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <button id="save-btn" class="button is-primary" @click="saveAndClose">
        {{ $t('actions.save') }}
      </button>
      <button v-if="value" id="delete-btn" class="button is-danger" @click="confirmDelete">
        Remove
      </button>
    </template>
  </Modal>
</template>

<script lang="ts">
import cloneDeep from 'lodash/cloneDeep';
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import Modal from '@/components/general/Modal.vue';
import ColorPicker from '@/components/webviz/ColorPicker.vue';
import LayerConfiguratorListing from '@/components/webviz/LayerConfiguratorListing';
import { hexToColorTriple } from '@/visualizers/maps/colorMaps';
import PropertySelector from '@/components/webviz/PropertySelector.vue';
import GeometrySelector from '@/components/webviz/GeometrySelector.vue';
import { LayerKind, Nullable, RGBAColor, VisualizerConfigurationSettings } from '@/types';
import { EntityGeometry } from '@/types/geometry';
import { cleanVisualizerSettings } from '@/visualizers/visualizerHelpers';
import FormValidator from '@/utils/FormValidator';
import ValidationProvider from '@/components/mixins/ValidationProvider';
import { VisualizerInfo } from '@/visualizers';
import { webvizStore } from '@/store/store';

function defaultLayerSettings(): VisualizerConfigurationSettings {
  return { kind: LayerKind.UNKNOWN };
}

@Component({
  name: 'EditLayerModal',
  components: { Modal, ColorPicker, GeometrySelector, PropertySelector }
})
export default class EditLayerModal extends Mixins(LayerConfiguratorListing, ValidationProvider) {
  @Prop({ type: Boolean, default: false }) readonly active!: boolean;
  @Prop([Object]) readonly value!: Nullable<VisualizerInfo>;

  local: VisualizerInfo = new VisualizerInfo();
  color: RGBAColor = hexToColorTriple('#A258DC');
  layerSettings: VisualizerConfigurationSettings = defaultLayerSettings();
  geometry: EntityGeometry | null = null;
  configuratorErrors: Record<string, string> = {};
  validator: FormValidator | null = null;

  setupValidator() {
    this.validator = new FormValidator({
      validators: {
        selectedLayerKind: () => {
          if (!this.selectedLayerKind) {
            return 'Please choose a layer type';
          }
        },
        currentDatasetName: () => {
          if (!this.currentDatasetName) {
            return 'Please select a dataset';
          }
        },
        currentEntityName: () => {
          if (!this.currentEntityName) {
            return 'Please select an entity group';
          }
        },
        geometry: () => {
          if (!this.geometry) {
            return 'Missing geometry';
          }
        }
      },
      onValidate: e => {
        this.errors = e;
      }
    });
  }

  get partialInfo(): VisualizerInfo {
    const currentDataset =
      this.datasets.filter(ds => ds.name === this.currentDatasetName)[0] || null;

    return new VisualizerInfo({
      datasetName: this.currentDatasetName as string,
      datasetUUID: currentDataset?.uuid,
      name: this.local.name || currentDataset?.display_name || '',
      scenarioUUID: webvizStore.settings?.scenario?.uuid,
      entityGroup: this.currentEntityName as string,
      geometry: this.geometry,
      mode: this.mode,
      visible: this.local.visible,
      settings: this.local.settings
    });
  }

  reset() {
    this.local = new VisualizerInfo();
    this.layerSettings = defaultLayerSettings();
    this.geometry = null;
    this.currentDatasetName = null;
    this.currentEntityName = null;
    this.selectedLayerKind = null;
    this.errors = {};
  }

  finalizeInfo(): VisualizerInfo | null {
    this.validator?.validate();
    if (this.hasErrors) return null;
    const info = this.partialInfo;
    if (this.layerSettings) {
      info.settings = cleanVisualizerSettings(this.layerSettings);
    }
    return info;
  }

  saveAndClose() {
    const info = this.finalizeInfo();
    if (info) {
      this.$emit('input', info);
      this.$emit('close');
    }
  }

  confirmDelete() {
    this.$emit('delete');
    this.$emit('close');
  }

  @Watch('value')
  updateValues(value: VisualizerInfo | null) {
    if (!value) {
      this.reset();
      return;
    }
    this.layerSettings = value.settings;
    this.geometry = value.geometry;
    this.local = cloneDeep(value);
    this.currentDatasetName = value.datasetName;
    this.currentEntityName = value.entityGroup;
    this.selectedLayerKind = value.settings.kind;
  }

  @Watch('active')
  onActive() {
    if (this.active) {
      this.initialize().then(() => {});
    } else {
      this.reset();
    }
  }

  @Watch('selectedLayerKind')
  updateLayerKind() {
    if (this.selectedLayerKind) {
      this.layerSettings.kind = this.selectedLayerKind;
    }
  }
  @Watch('currentEntityName')
  onCurrentEntity() {
    this.validator?.touch('selectedLayerKind');
  }

  async initialize() {
    this.updateValues(this.value);
    await this.getAvailableDatasets();
    await this.getSummary(this.currentDatasetName);
  }

  async mounted() {
    this.setupValidator();
    await this.initialize();
  }
}
</script>

<style scoped>
.edit-layer-modal {
  min-height: 400px;
  min-width: 900px;
}
</style>
