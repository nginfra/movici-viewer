import { defineStore } from "pinia";
import pick from "lodash/pick";

interface ApplicationSettings {
  locale: string;
  baseURL: string;
  features: string[];
  projections: Record<string, string>;
}

const defaultSettings: ApplicationSettings = {
  locale: "en",
  baseURL: "/",
  features: [],
  projections: {},
};
const localSettingsKeys: (keyof ApplicationSettings)[] = ["locale"];

export const useSettingsStore = defineStore("settings", {
  state: () => ({ ...defaultSettings }),
  actions: {
    hasFeature(feature: string) {
      if (!this.features) {
        return false;
      }

      try {
        return this.features.includes(feature);
      } catch {
        return false;
      }
    },

    loadLocal() {
      let localSettings: Partial<ApplicationSettings>;
      try {
        localSettings = pick(JSON.parse(localStorage.settings), ...localSettingsKeys);
      } catch {
        localSettings = {};
      }

      for (const key in localSettings) {
        assign(
          this,
          key as keyof ApplicationSettings,
          localSettings[key as keyof ApplicationSettings]
        );
      }
    },

    storeLocal() {
      localStorage.settings = JSON.stringify(
        localSettingsKeys.reduce((curr, key) => {
          assign(curr, key, this[key]);
          return curr;
        }, {} as Partial<ApplicationSettings>)
      );
    },

    update(newSettings: Partial<ApplicationSettings>) {
      this.$patch(newSettings);

      this.storeLocal();
    },
  },
});

function assign<T, K extends keyof T>(obj: T, key: keyof T, value: unknown) {
  obj[key] = value as T[K];
}
