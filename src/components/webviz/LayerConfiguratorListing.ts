import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import SummaryListing from '@/components/webviz/SummaryListing';
import { DummyConfigurator, StaticColorConfigurator } from '@/components/webviz/layerConfigurators';
import { VueConstructor } from 'vue';
import ColorMapConfigurator from '@/components/webviz/layerConfigurators/ColorMapConfigurator.vue';
import ActiveEntityConfigurator from '@/components/webviz/layerConfigurators/ActiveEntityConfigurator.vue';
import { LayerKind, VisualizationMode } from '@/types';
import { EntityGeometry } from '@/types/geometry';

type ConfiguratorInfo = {
  name: LayerKind;
  display_name: string;
  vueComponent: VueConstructor;
  priority: number;
};
const LayerConfigurators: Record<LayerKind, ConfiguratorInfo> = {
  [LayerKind.STATIC_COLOR]: {
    name: LayerKind.STATIC_COLOR,
    display_name: 'Static Color',
    vueComponent: StaticColorConfigurator,
    priority: 2
  },
  [LayerKind.HEAT_MAP]: {
    name: LayerKind.HEAT_MAP,
    display_name: 'Heat map',
    vueComponent: DummyConfigurator,
    priority: 4
  },
  [LayerKind.COLOR_MAP]: {
    name: LayerKind.COLOR_MAP,
    display_name: 'Color map',
    vueComponent: ColorMapConfigurator,
    priority: 1
  },
  [LayerKind.ACTIVE_ENTITY]: {
    name: LayerKind.ACTIVE_ENTITY,
    display_name: 'Active Entity',
    vueComponent: ActiveEntityConfigurator,
    priority: 3
  },
  [LayerKind.UNKNOWN]: {
    name: LayerKind.UNKNOWN,
    display_name: 'Unknown',
    vueComponent: DummyConfigurator,
    priority: 999
  }
};

const StaticVisualizerTypeMap = {
  [EntityGeometry.POINT]: [LayerKind.STATIC_COLOR, LayerKind.HEAT_MAP],
  [EntityGeometry.LINE]: [LayerKind.STATIC_COLOR],
  [EntityGeometry.POLYGON]: [LayerKind.STATIC_COLOR]
};

const ScenarioVisualizerTypeMap = {
  [EntityGeometry.POINT]: [LayerKind.COLOR_MAP, LayerKind.ACTIVE_ENTITY],
  [EntityGeometry.LINE]: [LayerKind.COLOR_MAP],
  [EntityGeometry.POLYGON]: [LayerKind.COLOR_MAP]
};

const DEFAULT_CONFIGURATOR = DummyConfigurator;
const ALL_LAYER_KINDS = [
  LayerKind.COLOR_MAP,
  LayerKind.STATIC_COLOR,
  LayerKind.ACTIVE_ENTITY,
  LayerKind.HEAT_MAP,
  LayerKind.UNKNOWN
];

@Component
export default class LayerConfiguratorListing extends Mixins(SummaryListing) {
  @Prop({ type: String, default: VisualizationMode.GEOMETRY }) mode!: VisualizationMode;

  geometry?: EntityGeometry | null;
  selectedLayerKind: LayerKind | null = null;

  get layerKinds(): LayerKind[] {
    if (!this.geometry) {
      return ALL_LAYER_KINDS;
    }
    const rv = [...StaticVisualizerTypeMap[this.geometry]];
    if (this.mode === VisualizationMode.SCENARIO) {
      rv.push(...ScenarioVisualizerTypeMap[this.geometry]);
    }
    return rv;
  }

  get layerConfigurators(): ConfiguratorInfo[] {
    return this.layerKinds.map(s => LayerConfigurators[s]).sort((a, b) => a.priority - b.priority);
  }

  get selectedLayerConfigurator(): VueConstructor {
    if (!this.selectedLayerKind) {
      return DEFAULT_CONFIGURATOR;
    }
    return LayerConfigurators[this.selectedLayerKind].vueComponent;
  }

  @Watch('layerKinds')
  resetLayerKind() {
    if (!this.selectedLayerKind || this.layerKinds.indexOf(this.selectedLayerKind) == -1) {
      this.selectedLayerKind = this.layerConfigurators.length
        ? this.layerConfigurators[0].name
        : null;
    }
  }
}
