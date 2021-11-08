import { Store } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import GeneralStore from './modules/GeneralStore';
import ApiStore from './modules/ApiStore';

let apiStore: ApiStore, generalStore: GeneralStore;

function initStores(store: Store<unknown>): void {
  // local
  apiStore = getModule(ApiStore, store);
  generalStore = getModule(GeneralStore, store);
}

export { initStores, generalStore, apiStore };
