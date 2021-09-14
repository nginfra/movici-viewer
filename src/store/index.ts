import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { initStores } from '@/store/store-accessor';
import FlowStore from '@/flow/stores/FlowStore';
import FlowUIStore from '@/flow/stores/FlowUserInterfaceStore';
import ApiStore from '@/store/modules/ApiStore';
import GeocodeStore from '@/flow/stores/GeocodeStore';
import SummaryStore from '@/flow/stores/SummaryStore';
import GeneralStore from './modules/GeneralStore';

Vue.use(Vuex);

export * from '@/store/store-accessor';

const store = new Store({
  plugins: [initStores],
  modules: {
    // local
    api: ApiStore,
    general: GeneralStore,
    // flow
    flow: FlowStore,
    flowUI: FlowUIStore,
    geocode: GeocodeStore,
    summary: SummaryStore
  }
});

export default store;
