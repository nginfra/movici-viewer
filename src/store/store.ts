import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { initializeFlowStores } from '@/store/store-accessor';
import FlowStore from '@/store/modules/FlowStore';
import FlowUIStore from '@/store/modules/FlowUserInterfaceStore';
import GeneralStore from '@/store/modules/GeneralStore';
import GeocodeStore from '@/store/modules/GeocodeStore';
import SummaryStore from '@/store/modules/SummaryStore';
import ViewStore from '@/store/modules/ViewStore';
import SomethingStore from '@/store/modules/SomethingStore';

Vue.use(Vuex);

export * from '@/store/store-accessor';

const store = new Store({
  plugins: [initializeFlowStores],
  modules: {
    // local
    somethingStore: SomethingStore,
    // flow
    geocode: GeocodeStore,
    general: GeneralStore,
    flow: FlowStore,
    flowUI: FlowUIStore,
    summary: SummaryStore,
    view: ViewStore
  }
});

export default store;
