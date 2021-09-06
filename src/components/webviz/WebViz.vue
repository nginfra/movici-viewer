<template>
  <div>
    <ExportModal
      :active="showExportModal"
      :scenario-uuid="currentScenarioUUID"
      :timestamp="timestamp"
      :timeline-info="timelineInfo"
      @close="showExportModal = false"
    ></ExportModal>
    <VizSidebar>
      <template v-slot:below-header="{ reduce }">
        <WebvizSettings :reduce="reduce" :value="settings" @input="setSettings($event)" />
      </template>
      <template v-slot:content="{ reduce }">
        <div class="is-flex is-flex-direction-column">
          <b-field class="is-flex-grow-1 is-flex-shrink-2">
            <LayerPicker v-model="layerInfos" :reduce="reduce" :mode="mode" @share="shareURL" />
          </b-field>
          <div class="buttons lower-buttons" :class="reduce ? 'is-centered' : 'is-right'">
            <BButton
              v-if="mode === 'scenario'"
              class="is-primary"
              @click="shareURL"
              icon-left="share-alt"
            >
              <template v-if="!reduce">Share URL</template>
            </BButton>
            <BButton class="is-primary" icon-left="download" @click="showExportModal = true">
              <template v-if="!reduce">{{ $t('actions.export') }}</template>
            </BButton>
          </div>
        </div>
      </template>
    </VizSidebar>
    <MapVis
      :layer-infos="validLayers"
      :timeline-info="timelineInfo"
      :view-state.sync="viewState"
      :timestamp.sync="timestamp"
      buildings
    >
      <template #control-right="{ map, onViewstateChange, basemap, setBasemap }">
        <SearchBar
          is-right
          :map="map"
          :view-state="viewState"
          @update:view-state="onViewstateChange($event)"
        />
        <NavigationControl is-right :value="viewState" @input="onViewstateChange($event)" />
        <BaseMapControl is-right :value="basemap" @input="setBasemap" />
      </template>
      <template #control-bottom="{ updateTimestamp }">
        <TimeSlider
          v-if="timelineInfo"
          :value="timestamp"
          @input="updateTimestamp($event)"
          :timeline-info="timelineInfo"
        />
      </template>
    </MapVis>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Deck from '@/components/webviz/Deck.vue';
import Buildings from '@/components/webviz/mapLayers/Buildings.vue';
import VizSidebar from '@/components/webviz/VizSidebar.vue';
import LayerPicker from '@/components/webviz/LayerPicker.vue';
import WebvizSettings from '@/components/webviz/WebvizSettings.vue';
import SearchBar from '@/components/webviz/controls/SearchBar.vue';
import NavigationControl from '@/components/webviz/controls/NavigationControl.vue';
import BaseMapControl from '@/components/webviz/controls/BaseMapControl.vue';
import TimeSlider from '@/components/webviz/TimeSlider.vue';

import {
  CameraOptions,
  EntityGroupSummary,
  Nullable,
  Project,
  TimeOrientedSimulationInfo,
  UUID,
  ViewConfig,
  VisualizationMode,
  VisualizationSettings
} from '@/types';
import WebvizStore from '@/store/modules/webviz';
import {
  datasetValidator,
  entityGroupValidator,
  layerInfosToLayerConfig,
  layerKindValidator,
  simplifiedCamera
} from '@/visualizers/viewHelpers';
import { copyToClipboard, getBaseURL, getEntitySummary } from '@/utils';
import { successMessage } from '@/snackbar';
import MapVis from '@/components/webviz/MapVis.vue';
import defaults from '@/components/webviz/defaults';
import isError from 'lodash/isError';

import { VisualizerInfo } from '@/visualizers';
import ExportModal from '@/components/webviz/ExportModal.vue';
import ProjectStore from '@/store/modules/ProjectStore';

@Component({
  name: 'WebViz',
  components: {
    Buildings,
    Deck,
    ExportModal,
    LayerPicker,
    SearchBar,
    NavigationControl,
    BaseMapControl,
    TimeSlider,
    VizSidebar,
    WebvizSettings,
    MapVis
  }
})
export default class WebViz extends Vue {
  @Prop([Object]) readonly viewConfig!: Nullable<ViewConfig>;
  layerInfos: VisualizerInfo[] = [];
  settings: VisualizationSettings | null = null;
  currentProjectUUID: string | null = null;
  timestamp = 0;
  datasetInfoContentErrors: Record<string, string[]> = {};
  viewState: Nullable<CameraOptions> = defaults.viewState();
  showExportModal = false;

  get mode() {
    return WebvizStore.mode;
  }

  get timelineInfo(): TimeOrientedSimulationInfo | null {
    return WebvizStore.timelineInfo;
  }

  get project(): Project | null {
    return ProjectStore.activeProject;
  }

  get currentScenarioUUID(): string | null {
    if (this.settings?.mode !== VisualizationMode.SCENARIO) {
      return null;
    }
    return this.settings?.scenario?.uuid ?? null;
  }

  @Watch('layerInfos')
  determineDuplicateErrors(layerInfos: VisualizerInfo[]) {
    const ids: Set<string> = new Set();
    for (const info of layerInfos) {
      info.unsetError('duplicate');

      if (ids.has(info.id)) {
        info.setError('duplicate', 'Duplicate data layer detected');
      }
      ids.add(info.id);
    }
  }

  get validLayers() {
    return this.layerInfos.filter(i => !Object.values(i.errors).length);
  }

  mounted() {
    if (this.project) {
      this.settings = defaults.visualisationSettings(this.project);
    }
    if (this.viewConfig) {
      this.parseViewConfig(this.viewConfig);
    }
  }

  setSettings(settings: VisualizationSettings | null) {
    const oldVal = this.settings;
    this.settings = settings;
    if (oldVal) {
      if (
        oldVal.project?.uuid !== settings?.project?.uuid ||
        oldVal.scenario?.uuid !== settings?.scenario?.uuid
      ) {
        this.layerInfos = [];
      }
    }
    if (this.settings) {
      WebvizStore.useSettings(this.settings).then(() => {});
    }
  }

  @Watch('viewConfig')
  parseViewConfig(value: ViewConfig) {
    WebvizStore.parseViewConfig(value)
      .then(result => {
        this.determineContentErrors(result.layerInfos);
        this.determineDuplicateErrors(result.layerInfos);
        return result;
      })
      .then(result => {
        this.layerInfos = result.layerInfos;
        this.viewState = result.camera;
        this.settings = result.settings;
        this.timestamp = result.timestamp;
      });
  }

  async determineContentErrors(infos: VisualizerInfo[]) {
    for (const info of infos) {
      info.unsetError('content');
      try {
        datasetValidator()(info);
        const datasetSummary = await WebvizStore.getDatasetSummary(info.datasetUUID as UUID);
        if (!datasetSummary) {
          throw new Error('Error contacting server');
        }
        entityGroupValidator(datasetSummary)(info);
        const entitySummary = getEntitySummary(info.entityGroup, datasetSummary);
        layerKindValidator(entitySummary as EntityGroupSummary)(info);
      } catch (e) {
        if (isError(e)) {
          info.setError('content', e.message);
        }
      }
    }
  }

  shareURL() {
    if (!this.project || !this.settings?.scenario || !this.viewState) {
      return;
    }
    const payload: ViewConfig = {
      project_name: this.project.name,
      scenario_name: this.settings.scenario.name,
      data_layers: layerInfosToLayerConfig(this.layerInfos),
      camera: simplifiedCamera(this.viewState),
      timestamp: this.timestamp
    };
    copyToClipboard(getBaseURL() + '?view=' + btoa(JSON.stringify(payload)));
    successMessage(this.$t('messages.viewCopiedToClipboard') as string);
  }
}
</script>

<style scoped lang="scss">
.lower-buttons {
  padding: 10px 0;
  background: $white-ter;
}
::v-deep {
  .map-control-left {
    left: 310px !important;
  }
  .map-control-bottom {
    width: 100% !important;
  }
}
</style>
