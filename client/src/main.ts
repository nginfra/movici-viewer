import "@/assets/sass/main.scss";

import { createPinia } from "pinia";
import { createApp } from "vue";

import i18n from "./i18n";
import router from "./router";

import Oruga, { OrugaComponentPlugins } from "@oruga-ui/oruga-next";
import { bulmaConfig } from "@oruga-ui/theme-bulma";
import merge from "lodash/merge";

import App from "./App.vue";
import Flow, { orugaConfig } from "@movici-flow-lib";

const app = createApp(App);

// Oruga 0.13 no longer registers anything on `app.use(Oruga, …)` beyond config.
// Install the Oruga instance with our merged config, then register every
// component plugin against that instance. Installing the *plugins* (not
// app.component) is what also wires the programmatic API — oruga.modal /
// oruga.notification — used by useDialog / useSnackbar / the Export button.
app.use(Oruga, merge({}, bulmaConfig, orugaConfig));
OrugaComponentPlugins.forEach((plugin) => app.use(plugin, { oruga: Oruga }));

app
  .use(createPinia())
  .use(router)
  .use(i18n)
  .use(Flow, {
    homeRoute: {
      name: "home",
    },
  })
  .mount("#app");
