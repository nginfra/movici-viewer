import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { initStores } from '@/store/store-accessor';
import GeneralStore from '@/store/modules/GeneralStore';
import ApiStore from '@/store/modules/ApiStore';
import { initFlowStores } from '@movici-flow-common/store/store-accessor';
import FlowStore from '@movici-flow-common/store/FlowStore';
import FlowUIStore from '@movici-flow-common/store/FlowUserInterfaceStore';
import FlowVisualizationStore from '@movici-flow-common/store/FlowVisualizationStore';
import GeocodeStore from '@movici-flow-common/store/GeocodeStore';

Vue.use(Vuex);

export * from '@/store/store-accessor';
export * from '@movici-flow-common/store/store-accessor';

const store = new Store({
  plugins: [initStores, initFlowStores],
  modules: {
    // local
    api: ApiStore,
    general: GeneralStore,
    // flow
    flow: FlowStore,
    flowVisualization: FlowVisualizationStore,
    flowUI: FlowUIStore,
    geocode: GeocodeStore
  }
});

export default store;
