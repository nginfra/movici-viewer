import { Store } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import FlowStore from '@/store/modules/FlowStore';
import GeneralStore from '@/store/modules/GeneralStore';
import GeocodeStore from './modules/GeocodeStore';
import ProjectStore from '@/store/modules/ProjectStore';
import ScenarioStore from './modules/ScenarioStore';
import SummaryStore from './modules/SummaryStore';
import ViewStore from './modules/ViewStore';
import WebvizStore from './modules/webviz';
import SomethingStore from './modules/SomethingStore';
import FlowUIStore from './modules/FlowUserInterfaceStore';

let flowStore: FlowStore,
  flowUIStore: FlowUIStore,
  projectStore: ProjectStore,
  generalStore: GeneralStore,
  geocodeStore: GeocodeStore,
  scenarioStore: ScenarioStore,
  summaryStore: SummaryStore,
  viewStore: ViewStore,
  webvizStore: WebvizStore;

function initializeFlowStores(store: Store<unknown>): void {
  flowStore = getModule(FlowStore, store);
  flowUIStore = getModule(FlowUIStore, store);
  projectStore = getModule(ProjectStore, store);
  generalStore = getModule(GeneralStore, store);
  geocodeStore = getModule(GeocodeStore, store);
  scenarioStore = getModule(ScenarioStore, store);
  summaryStore = getModule(SummaryStore, store);
  viewStore = getModule(ViewStore, store);
  webvizStore = getModule(WebvizStore, store);
}

export {
  initializeFlowStores,
  flowStore,
  flowUIStore,
  generalStore,
  geocodeStore,
  projectStore,
  scenarioStore,
  summaryStore,
  viewStore,
  webvizStore,
  FlowStore,
  ProjectStore,
  GeneralStore,
  GeocodeStore,
  ScenarioStore,
  SummaryStore,
  ViewStore,
  WebvizStore,
  SomethingStore
};
