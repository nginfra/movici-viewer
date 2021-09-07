import i18n from '../../i18n';
import pick from 'lodash/pick';
import { failMessage } from '@/snackbar';
import Client from '@/api/client';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { ApplicationSettings, ColorRuleSet } from '@/types';
import baseColorRuleSet from '@/visualizers/baseColorRuleSet';
import cloneDeep from 'lodash/cloneDeep';
import { GetGlobalSettings } from '@/api/requests';
import store from '@/store/store';

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

@Module({
  name: 'general',
  namespaced: true,
  dynamic: true,
  store
})
class GeneralStore extends VuexModule {
  initialized = false;
  settings!: ApplicationSettings;

  @Mutation
  SET_INITIALIZED() {
    this.initialized = true;
  }

  @Mutation
  UPDATE_SETTINGS(payload: Partial<ApplicationSettings>) {
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
    try {
      await this.loadLocalSettings();
      await this.setLanguage(this.language);
      await this.loadRemoteSettings();

      setTimeout(() => {
        this.SET_INITIALIZED();
      }, 100);
    } catch (e) {
      console.error(e);
    }
  }

  @Action({ rawError: true })
  loadLocalSettings() {
    const localSettings = getLocalSettings();
    return this.updateSettings({ ...defaultSettings, ...localSettings });
  }

  @Action({ rawError: true })
  setLanguage(lang: string) {
    i18n.locale = lang;
    return this.updateSettings({ Language: lang });
  }

  @Action({ rawError: true })
  updateSettings(settings: Partial<ApplicationSettings>) {
    this.UPDATE_SETTINGS(settings);
  }

  @Action({ rawError: true })
  async loadRemoteSettings() {
    const settings = (await this.api.request(new GetGlobalSettings())) ?? {};
    this.UPDATE_SETTINGS(settings);
  }

  get isLocalhost() {
    return this.settings.localhost;
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
    return this.settings.Language ?? '';
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

export default getModule(GeneralStore);
