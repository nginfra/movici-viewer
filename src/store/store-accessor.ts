import { Store } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import GeneralStore from '@/store/modules/GeneralStore';
import ApiStore from '@/store/modules/ApiStore';
import FlowStore from '@/flow/stores/FlowStore';
import FlowUIStore from '@/flow/stores/FlowUserInterfaceStore';
import GeocodeStore from '@/flow/stores/GeocodeStore';
import SummaryStore from '@/flow/stores/SummaryStore';

let flowStore: FlowStore,
  flowUIStore: FlowUIStore,
  apiStore: ApiStore,
  generalStore: GeneralStore,
  geocodeStore: GeocodeStore,
  summaryStore: SummaryStore;

function initStores(store: Store<unknown>): void {
  // local
  apiStore = getModule(ApiStore, store);
  generalStore = getModule(GeneralStore, store);
  // flow
  flowStore = getModule(FlowStore, store);
  flowUIStore = getModule(FlowUIStore, store);
  geocodeStore = getModule(GeocodeStore, store);
  summaryStore = getModule(SummaryStore, store);
}

export { initStores, generalStore, apiStore, flowStore, flowUIStore, geocodeStore, summaryStore };
