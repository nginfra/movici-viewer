import "@/assets/sass/main.scss";

import { createPinia } from "pinia";
import { createApp } from "vue";

import i18n from "./i18n";
import router from "./router";

import App from "./App.vue";
import Flow from "@nginfra/movici-flow-lib";

// Oruga (config + component plugins + programmatic API) is installed by the Flow
// plugin now, so the host only needs `app.use(Flow, …)`.
createApp(App)
  .use(createPinia())
  .use(router)
  .use(i18n)
  .use(Flow, {
    homeRoute: {
      name: "home",
    },
    mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN,
  })
  .mount("#app");
