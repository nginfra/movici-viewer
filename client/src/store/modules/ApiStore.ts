import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { failMessage } from '@movici-flow-common/utils/snackbar';
import { Client } from '@movici-flow-common/api';
import { bindAPI } from '@movici-flow-common/store/store-accessor';
import Backend from '../../api/MockBackend';
// import Backend from '@/api/LocalBackend';

const API_CONCURRENCY = 10;

function defaultClient(baseURL: string, apiToken: string | null): Client {
  return new Client({
    baseURL: baseURL,
    apiToken: apiToken,
    concurrency: API_CONCURRENCY,
    defaultCallbacks: {
      http(e) {
        failMessage(e.message);
      }
    }
  });
}

@Module({
  name: 'api',
  namespaced: true
})
class ApiStore extends VuexModule {
  client_: Client | null = null;
  baseURL = '/';
  apiToken: string | null = null;
  isLoggedIn = false;
  logoutMessage = '';
  logoutMessageType = 'is-warning';

  get client() {
    return this.client_ || defaultClient(this.baseURL, this.apiToken);
  }

  @Mutation
  CONFIGURE_CLIENT(client: Client) {
    this.client_ = client;
    this.baseURL = client.baseURL;

    bindAPI(new Backend(client));
  }

  @Mutation
  SET_BASE_URL(baseUrl: string) {
    this.baseURL = baseUrl;
  }

  @Action({ rawError: true })
  configureClient(settings: { baseURL?: string; apiToken?: string | null }) {
    this.CONFIGURE_CLIENT(
      new Client({
        baseURL: settings.baseURL !== undefined ? settings.baseURL : this.baseURL,
        apiToken: settings.apiToken !== undefined ? settings.apiToken : this.apiToken,
        concurrency: API_CONCURRENCY,
        defaultCallbacks: {
          http(e) {
            failMessage(e.message);
          }
        }
      })
    );
  }
}
export default ApiStore;
