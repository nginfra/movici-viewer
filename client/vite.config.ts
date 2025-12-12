import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

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
  plugins: [vue()],
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
