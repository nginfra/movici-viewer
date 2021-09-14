/**
 * Top level store module. This one cannot depend on any other store modules to prevent circular
 * dependencies
 */

import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import Client from '@/api/client';
import { failMessage } from '@/snackbar';
//  import { CheckToken, LoginRequest, LogoutRequest } from '@/api/requests';

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
  }

  @Mutation
  SET_BASE_URL(baseUrl: string) {
    this.baseURL = baseUrl;
  }

  @Mutation
  SET_LOGIN_STATUS(payload: { isLoggedIn: boolean; token?: string | null }) {
    this.isLoggedIn = payload.isLoggedIn;
    if (payload.token) {
      this.apiToken = payload.token;
      localStorage.apiToken = payload.token;
    }
  }

  @Mutation
  CLEAR_LOGIN_STATUS() {
    this.isLoggedIn = false;
    this.apiToken = null;
    localStorage.removeItem('apiToken');
  }

  @Mutation
  SET_LOGOUT_MESSAGE(payload: { type: string; message: string }) {
    this.logoutMessage = payload.message;
    this.logoutMessageType = payload.type || 'is-warning';
  }

  @Action({ rawError: true })
  configureClient(settings: { baseURL?: string; apiToken?: string | null }) {
    this.CONFIGURE_CLIENT(
      new Client({
        baseURL: settings.baseURL !== undefined ? settings.baseURL : this.baseURL,
        apiToken: settings.apiToken !== undefined ? settings.apiToken : this.apiToken,
        concurrency: API_CONCURRENCY,
        defaultCallbacks: {
          //  401: () => this.forceLogout(),
          http(e) {
            failMessage(e.message);
          }
        }
      })
    );
  }

  // @Action({ rawError: true })
  // async initToken() {
  //   const token = localStorage.apiToken;

  //   if (!token) {
  //     return;
  //   }
  //   let resp;
  //   try {
  //     resp = await this.client.request(new CheckToken(token), {
  //       401: () => {
  //         this.CLEAR_LOGIN_STATUS();
  //         this.SET_LOGOUT_MESSAGE({
  //           message: 'You have been logged out automatically.',
  //           type: 'is-warning'
  //         });
  //       }
  //     });
  //   } catch (e) {
  //     console.error(e);
  //   } finally {
  //     if (resp) {
  //       this.SET_LOGIN_STATUS({
  //         token: token,
  //         isLoggedIn: true
  //       });
  //     }
  //   }
  // }

  //  @Action({ rawError: true })
  //  async login(payload: { username: string; password: string }) {
  //    const { commit } = this.context;
  //    let resp;
  //    try {
  //      resp = await this.client.request(new LoginRequest(payload.username, payload.password));
  //    } catch (e) {
  //      console.error(e);
  //    } finally {
  //      if (resp) {
  //        this.configureClient({ apiToken: resp.session });
  //        commit('SET_LOGIN_STATUS', {
  //          isLoggedIn: true,
  //          token: resp.session
  //        });
  //      } else {
  //        commit('SET_LOGOUT_MESSAGE', {
  //          message: 'Unable to log in',
  //          type: 'is-danger'
  //        });
  //      }
  //    }
  //  }

  //  @Action({ rawError: true })
  //  async logout() {
  //    try {
  //      await this.client.request(new LogoutRequest());
  //      this.configureClient({ apiToken: null });
  //      this.context.commit('CLEAR_LOGIN_STATUS');
  //      this.context.commit('SET_LOGOUT_MESSAGE', {
  //        message: 'You have been successfully logged out.',
  //        type: 'is-success'
  //      });
  //    } catch (e) {
  //      console.error(e);
  //    }
  //  }

  //  @Action({ rawError: true })
  //  forceLogout() {
  //    this.configureClient({ apiToken: null });
  //    this.context.commit('SET_LOGOUT_MESSAGE', {
  //      message: 'You have been automatically logged out for security reasons.',
  //      type: 'is-warning'
  //    });
  //    this.context.commit('CLEAR_LOGIN_STATUS');
  //  }
}
export default ApiStore;
