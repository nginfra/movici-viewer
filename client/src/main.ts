import "@/assets/sass/main.scss";

import { createPinia } from "pinia";
import { createApp } from "vue";

import i18n from "./i18n";
import router from "./router";

import Oruga from "@oruga-ui/oruga-next";
import { bulmaConfig } from "@oruga-ui/theme-bulma";
import merge from "lodash/merge";

import App from "./App.vue";
import Flow, { orugaConfig } from "@movici-flow-lib";

createApp(App)
  .use(Oruga, merge(bulmaConfig, orugaConfig))
  .use(createPinia())
  .use(router)
  .use(i18n)
  .use(Flow, {
    homeRoute: {
      name: "home",
    },
  })
  .mount("#app");
