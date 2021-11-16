import i18n from '@/i18n';
import pick from 'lodash/pick';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { ApplicationSettings } from '@movici-flow-common/types';
import { GetGlobalSettings } from '@/api/requests';
import { apiStore } from '@/store';

const DEFAULT_LANGUAGE = 'en';
const defaultSettings = {
  Language: DEFAULT_LANGUAGE
};

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
  namespaced: true
})
class GeneralStore extends VuexModule {
  initialized_ = false;
  settings_!: ApplicationSettings;

  @Mutation
  SET_INITIALIZED() {
    this.initialized_ = true;
  }

  @Mutation
  UPDATE_SETTINGS(payload: Partial<ApplicationSettings>) {
    console.log('here', payload);

    const localSettingsKeys = ['Language'];
    const localSettings = pick(payload, localSettingsKeys);

    const currentSettings = getLocalSettings();
    localStorage.settings = JSON.stringify({
      ...currentSettings,
      ...localSettings
    });

    this.settings_ = { ...this.settings_, ...payload };
  }

  @Action({ rawError: true })
  async initApp() {
    try {
      this.loadLocalSettings();
      this.setLanguage(this.language);
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
    this.UPDATE_SETTINGS({ ...defaultSettings, ...localSettings });
  }

  @Action({ rawError: true })
  setLanguage(lang: string) {
    i18n.locale = lang;
    return this.UPDATE_SETTINGS({ Language: lang });
  }

  @Action({ rawError: true })
  async loadRemoteSettings() {
    const settings = await apiStore.client.request(new GetGlobalSettings());
    if (settings) {
      this.UPDATE_SETTINGS(settings);
      apiStore.configureClient({ baseURL: settings.ApiAddress });
    }
  }

  get initialized(): boolean {
    return this.initialized_;
  }

  get settings() {
    return this.settings_ ?? {};
  }

  get apiBase() {
    return this.settings.ApiAddress ?? '/';
  }

  get language() {
    return this.settings.Language ?? DEFAULT_LANGUAGE;
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
}

export default GeneralStore;
