import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // TODO: we should fix these deprecations, but we have until dart sass v3
        silenceDeprecations: ["import", "color-functions", "global-builtin"],
        additionalData: `
       @use "@/assets/sass/variables.scss" as *;
      `,
      },
    },
  },
  plugins: [vue(), vueDevTools()],
  // flow-lib is a linked workspace package consumed from source in dev; exclude it
  // from pre-bundling and pre-include its (heavy) deps so vite optimizes them once
  // upfront instead of re-optimizing on lazy discovery (which causes 504s).
  optimizeDeps: {
    exclude: ["@nginfra/movici-flow-lib"],
    include: [
      "@oruga-ui/oruga-next",
      "@oruga-ui/theme-bulma",
      "@deck.gl/core",
      "@deck.gl/layers",
      "@deck.gl/extensions",
      "@deck.gl-community/editable-layers",
      "@luma.gl/core",
      "@luma.gl/engine",
      "mapbox-gl",
      "chart.js",
      "vue-chartjs",
      "chartjs-plugin-annotation",
      "@ckpack/vue-color",
      "vuedraggable",
      "@turf/helpers",
      "@turf/nearest-point-on-line",
      "proj4",
      "reproject",
      "geotiff",
      "@placemarkio/geo-viewport",
      "axios",
      "lodash",
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {},
      },
    },
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  server: {
    port: 8080,
  },
  resolve: {
    // @nginfra/movici-flow-lib resolves to dist in the prod build (via the package
    // "exports" map) and to its src in dev (vite serves linked workspace packages
    // from source for HMR). When dev consumes that source, flow-lib's internal
    // "@movici-flow-lib/*" self-imports must resolve too — hence this alias. It is
    // unused in the prod build (dist has no "@movici-flow-lib" references).
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
      {
        find: "@movici-flow-lib",
        replacement: fileURLToPath(new URL("./movici-flow-lib/src", import.meta.url)),
      },
    ],
  },
});
