import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { apiStore, bindAPI, initStores } from '@/store/store-accessor';
import FlowStore from '@/flow/stores/FlowStore';
import FlowUIStore from '@/flow/stores/FlowUserInterfaceStore';
import GeneralStore from './modules/GeneralStore';
import ApiStore from '@/store/modules/ApiStore';
import GeocodeStore from '@/flow/stores/GeocodeStore';
import SummaryStore from '@/flow/stores/SummaryStore';
import LocalBackend from '@/backend/LocalBackend';

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

bindAPI(new LocalBackend(apiStore.client));

export default store;
