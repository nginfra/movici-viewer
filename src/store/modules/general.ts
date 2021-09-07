import i18n from '../../i18n';
import pick from 'lodash/pick';
import { failMessage } from '@/snackbar';
import Client from '@/api/client';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { ApplicationSettings, ColorRuleSet } from '@/types';
import baseColorRuleSet from '@/visualizers/baseColorRuleSet';
import cloneDeep from 'lodash/cloneDeep';
import { GetGlobalSettings } from '@/api/requests';

const defaultSettings = {
  Language: 'en'
};

const fixedSettings = {};

function getLocalSettings() {
  let localSettings;
  try {
    localSettings = JSON.parse(localStorage.settings);
  } catch {
    localSettings = {};
  }
  return localSettings;
}

@Module
export default class GeneralStore extends VuexModule {
  initialized = false;
  settings: Partial<ApplicationSettings> = {};

  @Mutation
  SET_INITIALIZED() {
    this.initialized = true;
  }

  @Mutation
  UPDATE_SETTINGS(payload: ApplicationSettings) {
    const localSettingsKeys = ['Language'];
    payload = { ...payload, ...fixedSettings };
    const localSettings = pick(payload, localSettingsKeys);

    const currentSettings = getLocalSettings();
    localStorage.settings = JSON.stringify({
      ...currentSettings,
      ...localSettings
    });

    this.settings = { ...this.settings, ...payload };
  }

  @Action({ rawError: true })
  async initApp() {
    const { commit, getters, dispatch } = this.context;
    try {
      await dispatch('loadLocalSettings');
      await dispatch('setLanguage', getters.language);
      await dispatch('loadRemoteSettings');

      const wait_for_ms = 100;
      setTimeout(() => {
        commit('SET_INITIALIZED');
      }, wait_for_ms);
    } catch (e) {
      console.error(e);
    }
  }

  @Action({ rawError: true })
  loadLocalSettings() {
    const dispatch = this.context.dispatch;
    const localSettings = getLocalSettings();
    return dispatch('updateSettings', { ...defaultSettings, ...localSettings });
  }

  @Action({ rawError: true })
  setLanguage(lang: string) {
    const dispatch = this.context.dispatch;
    i18n.locale = lang;
    return dispatch('updateSettings', { Language: lang });
  }

  @Action({ rawError: true, commit: 'UPDATE_SETTINGS' })
  updateSettings(settings: ApplicationSettings) {
    return settings;
  }

  @Action({ rawError: true, commit: 'UPDATE_SETTINGS' })
  async loadRemoteSettings() {
    return await this.api.request(new GetGlobalSettings());
  }

  get apiBase() {
    return this.settings.ApiAddress ?? '/';
  }

  get colorRuleSet(): ColorRuleSet {
    const mergedRules = cloneDeep(baseColorRuleSet);
    Object.assign(mergedRules.colors, this.settings.colorRuleSet?.colors);
    mergedRules.rules.push(...(this.settings.colorRuleSet?.rules || []));
    return mergedRules;
  }
  get language() {
    return this.settings.Language;
  }

  get featureToggle() {
    return (feature: string) => {
      if (!this.settings.features) {
        return false;
      }
      try {
        return this.settings.features.indexOf(feature) > -1;
      } catch (e) {
        return false;
      }
    };
  }
  get apiToken() {
    return this.context.rootGetters['currentUser/apiToken'];
  }

  get api() {
    return new Client({
      baseURL: this.apiBase,
      apiToken: this.apiToken,
      concurrency: 10,
      defaultCallbacks: {
        401: () => {
          // import locally to prevent circular dependency with dynamic store module
          import('@/store/modules/CurrentUserStore').then(result => {
            result.default.forceLogout();
          });
        },
        http(e) {
          failMessage(e.message);
          throw e;
        }
      }
    });
  }
}
