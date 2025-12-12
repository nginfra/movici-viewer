import { createI18n, type I18nOptions } from "vue-i18n";
import type { LocaleMessages } from "vue-i18n";
import { messages } from "@/locales";
import { messages as commonMessages } from "@movici-flow-lib/locales";
import merge from "lodash/merge";

function loadLocaleMessages<Schema>(messagesArray: Array<LocaleMessages<Schema>>) {
  return messagesArray.reduce((agg, curr) => {
    for (const key of Object.keys(curr)) {
      const matched = key.match(/([a-zA-Z_]+)\.json$/i);
      if (matched && matched.length > 1) {
        const locale = matched[1]!;
        agg[locale] = merge(agg[locale], curr[key]!);
      }
    }
    return agg;
  }, {} as Required<I18nOptions>["messages"]);
}

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: loadLocaleMessages([...messages, ...commonMessages]),
});

export default i18n;
export const global = i18n.global;
