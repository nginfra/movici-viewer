/**
 * Top level store module. This one cannot depend on any other store modules to prevent circular
 * dependencies
 */

import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { failMessage } from '~flow/utils/snackbar';
import { Client } from '~flow/api';
import { bindAPI } from '~flow/store/store-accessor';
import MockBackend from '@/api/MockBackend';

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
// Create a backend service that will work as interface
// Local and Remote clients inherit this interface but have different methods
// Implement method getCapabilities that will respond if some actions are possible (projects, currentUser...)
// FlowComponent requests data from FlowStore
//    |--> FlowStore calls client interface (local or remote)
//    |--> Interface calls other Store (Datasets, Projects, etc)

// Local Client

// Remote Client
// Uses stores to get data, summaries and resources
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

    bindAPI(new MockBackend(client));
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
