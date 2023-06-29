import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: { additionalData: `@import "./src/assets/sass/variables.scss";` }
    }
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
    APP_VERSION: JSON.stringify(process.env.npm_package_version)
  },
  server: {
    port: 8080
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url))
      },
      {
        find: '@movici-flow-lib',
        replacement: fileURLToPath(new URL('./movici-flow-lib/src', import.meta.url))
      }
    ]
  }
})
