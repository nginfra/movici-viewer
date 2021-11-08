import Vue from 'vue';
import VueI18n, { LocaleMessages } from 'vue-i18n';
import locales from '@/locales';
import merge from 'lodash/merge';
Vue.use(VueI18n);

function matchAndExtractTranslattions(
  key: string,
  messages: LocaleMessages,
  translation: (key: string) => LocaleMessages
) {
  const matched = key.match(/([A-Za-z0-9-_]+)\./i);

  if (matched && matched.length > 1) {
    const locale = matched[1];
    messages[locale] = merge(messages[locale], translation(key));
  }

  return messages;
}

function loadLocaleMessages(): LocaleMessages {
  let messages: LocaleMessages = {};

  locales.local.keys().forEach(key => {
    messages = matchAndExtractTranslattions(key, messages, locales.local);
  });

  locales.flow.keys().forEach(key => {
    messages = matchAndExtractTranslattions(key, messages, locales.flow);
  });

  return messages;
}
const i18n = new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages() || {}
});

export default i18n;
