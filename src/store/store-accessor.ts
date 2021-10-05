import { Store } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import GeneralStore from '@/store/modules/GeneralStore';
import ApiStore from '@/store/modules/ApiStore';

let apiStore: ApiStore, generalStore: GeneralStore;

function initStores(store: Store<unknown>): void {
  // local
  apiStore = getModule(ApiStore, store);
  generalStore = getModule(GeneralStore, store);
}

export { initStores, generalStore, apiStore };
