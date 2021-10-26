import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import GeneralStore from '@/store/modules/GeneralStore';
import ApiStore from '@/store/modules/ApiStore';
import { initStores } from '@/store/store-accessor';
import { initFlowStores } from '~flow/store/store-accessor';
import FlowStore from '~flow/store/FlowStore';
import FlowUIStore from '~flow/store/FlowUserInterfaceStore';
import GeocodeStore from '~flow/store/GeocodeStore';

Vue.use(Vuex);

export * from '@/store/store-accessor';
export * from '~flow/store/store-accessor';

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

export default store;
