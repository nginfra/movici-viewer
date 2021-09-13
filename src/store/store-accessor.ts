import { Store } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import FlowStore from '@/store/modules/FlowStore';
import GeneralStore from '@/store/modules/GeneralStore';
import GeocodeStore from './modules/GeocodeStore';
import SummaryStore from './modules/SummaryStore';
import ViewStore from './modules/ViewStore';
import FlowUIStore from './modules/FlowUserInterfaceStore';

let flowStore: FlowStore,
  flowUIStore: FlowUIStore,
  generalStore: GeneralStore,
  geocodeStore: GeocodeStore,
  summaryStore: SummaryStore,
  viewStore: ViewStore;

function initializeFlowStores(store: Store<unknown>): void {
  flowStore = getModule(FlowStore, store);
  flowUIStore = getModule(FlowUIStore, store);
  generalStore = getModule(GeneralStore, store);
  geocodeStore = getModule(GeocodeStore, store);
  summaryStore = getModule(SummaryStore, store);
  viewStore = getModule(ViewStore, store);
}

export {
  initializeFlowStores,
  flowStore,
  flowUIStore,
  generalStore,
  geocodeStore,
  summaryStore,
  viewStore,
  FlowStore,
  GeneralStore,
  GeocodeStore,
  SummaryStore,
  ViewStore
};
