import i18n from '../../i18n';
import pick from 'lodash/pick';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { ApplicationSettings } from '@/flow/types';
import { GetGlobalSettings } from '@/api/requests';
import { apiStore } from '@/store/store-accessor';

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
    const localSettingsKeys = ['Language'];
    payload = { ...payload, ...fixedSettings };
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
    const settings = (await apiStore.client.request(new GetGlobalSettings())) ?? {};
    this.UPDATE_SETTINGS(settings);
  }

  get initialized(): boolean {
    return this.initialized_;
  }

  get settings() {
    return this.settings_;
  }

  get isLocalhost() {
    return this.settings_.localhost;
  }

  get apiBase() {
    return this.settings_.ApiAddress ?? '/';
  }

  get language() {
    return this.settings_.Language ?? '';
  }

  get featureToggle() {
    return (feature: string) => {
      if (!this.settings_.features) {
        return false;
      }

      try {
        return this.settings_.features.indexOf(feature) > -1;
      } catch (e) {
        return false;
      }
    };
  }
}

export default GeneralStore;
