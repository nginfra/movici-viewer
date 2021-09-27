import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import GeneralStore from '@/store/modules/GeneralStore';
import ApiStore from '@/store/modules/ApiStore';
import { apiStore, initStores } from '@/store/store-accessor';
import { initFlowStores, bindAPI } from '@/flow/src/store/store-accessor';
import FlowStore from '@/flow/src/store/FlowStore';
import FlowUIStore from '@/flow/src/store/FlowUserInterfaceStore';
import GeocodeStore from '@/flow/src/store/GeocodeStore';
import LocalBackend from '@/api/LocalBackend';

Vue.use(Vuex);

export * from '@/store/store-accessor';
export * from '@/flow/src/store/store-accessor';

const store = new Store({
  plugins: [initStores, initFlowStores],
  modules: {
    // local
    api: ApiStore,
    general: GeneralStore,
    // flow
    flow: FlowStore,
    flowUI: FlowUIStore,
    geocode: GeocodeStore
  }
});

bindAPI(new LocalBackend(apiStore.client));

export default store;
