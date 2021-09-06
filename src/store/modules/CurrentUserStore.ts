import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { ProfileUpdate, SetAccountPasswordPayload, User } from '@/types';
import store from '@/store/store';
import {
  ActivateAccount,
  CheckToken,
  ForgotPassword,
  GetProfile,
  LoginRequest,
  LogoutRequest,
  ResetPassword,
  UpdateProfile
} from '@/api/requests';
import Client from '@/api/client';

@Module({
  name: 'currentUser',
  namespaced: true,
  dynamic: true,
  store
})
class CurrentUserStore extends VuexModule {
  user: User | null = null;
  isLoggedIn = false;
  token: null | string = null;

  logoutMessage = '';
  logoutMessageType = 'is-warning';

  @Mutation
  SET_LOGIN_STATUS(payload: { isLoggedIn: boolean; token?: string }) {
    this.isLoggedIn = payload.isLoggedIn;
    if (payload.token) {
      this.token = payload.token;
      localStorage.apiToken = payload.token;
    }
  }
  @Mutation
  SET_CURRENT_USER(user: User) {
    user.active = true;
    this.user = user;
  }
  @Mutation
  CLEAR_LOGIN_STATUS() {
    this.isLoggedIn = false;
    this.token = null;
    localStorage.removeItem('apiToken');
  }
  @Mutation
  SET_LOGOUT_MESSAGE(payload: { type: string; message: string }) {
    this.logoutMessage = payload.message;
    this.logoutMessageType = payload.type || 'is-warning';
  }
  @Action({ rawError: true })
  async initToken() {
    const token = localStorage.apiToken;

    if (!token) {
      return;
    }
    const resp = await this.context.rootGetters.api.request(new CheckToken(token), {
      401: () => {
        this.context.commit('CLEAR_LOGIN_STATUS');
        this.context.commit('SET_LOGOUT_MESSAGE', {
          message: 'You have been logged out automatically.',
          type: 'is-warning'
        });
      }
    });
    if (resp !== null) {
      this.context.commit('SET_LOGIN_STATUS', {
        token: token,
        isLoggedIn: true
      });
    }
  }
  @Action({ rawError: true })
  async doLogin(payload: { username: string; password: string }) {
    const { commit, rootGetters } = this.context;
    try {
      const resp = await rootGetters.api.request(
        new LoginRequest(payload.username, payload.password)
      );
      commit('SET_LOGIN_STATUS', {
        isLoggedIn: true,
        token: resp.session
      });
    } catch (e) {
      commit('SET_LOGOUT_MESSAGE', {
        message: 'Unable to log in',
        type: 'is-danger'
      });
    }
  }

  @Action({ rawError: true })
  async doLogout() {
    const { commit, rootGetters } = this.context;

    try {
      await rootGetters.api.request(new LogoutRequest());
      commit('CLEAR_LOGIN_STATUS');
      commit('SET_LOGOUT_MESSAGE', {
        message: 'You have been successfully logged out.',
        type: 'is-success'
      });
    } catch (e) {
      console.error(e);
    }
  }

  @Action({ rawError: true })
  forceLogout() {
    const commit = this.context.commit;
    commit('SET_LOGOUT_MESSAGE', {
      message: 'You have been automatically logged out for security reasons.',
      type: 'is-warning'
    });
    commit('CLEAR_LOGIN_STATUS');
  }
  @Action({ rawError: true })
  async doForgotPassword(payload: { username: string }) {
    const api: Client = this.context.rootGetters.api;
    return await api.request(new ForgotPassword(payload));
  }
  @Action({ rawError: true })
  async doResetPassword(payload: SetAccountPasswordPayload) {
    const api: Client = this.context.rootGetters.api;
    return await api.request(new ResetPassword(payload));
  }
  @Action({ rawError: true })
  async doActivateAccount(payload: SetAccountPasswordPayload) {
    const api: Client = this.context.rootGetters.api;
    return await api.request(new ActivateAccount(payload));
  }
  @Action({ rawError: true })
  async getCurrentUser() {
    const { commit } = this.context;
    const api: Client = this.context.rootGetters.api;
    const profile = await api.request(new GetProfile());
    if (profile) {
      commit('SET_CURRENT_USER', profile);
    }
  }
  @Action({ rawError: true })
  async updateProfile(payload: ProfileUpdate) {
    const api: Client = this.context.rootGetters.api;
    return await api.request(new UpdateProfile(payload));
  }

  get apiToken() {
    return this.token;
  }
  get fullName() {
    if (!this.user) {
      return '';
    }
    const firstName = this.user.firstname ? this.user.firstname : '';
    const middleSection = this.user.middlename ? ' ' + this.user.middlename + ' ' : ' ';
    const lastName = this.user.lastname ? this.user.lastname : '';
    return firstName + middleSection + lastName;
  }
}

export default getModule(CurrentUserStore);
