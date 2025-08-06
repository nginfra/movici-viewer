import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          axios: [
            'default' // import { default as axios } from 'axios'
          ]
        }
      ],
      dts: true, // Generate auto-imports.d.ts
      vueTemplate: true // Enable auto import in <template>
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@movici-flow-lib': fileURLToPath(new URL('./movici-flow-lib/src', import.meta.url))
    }
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries for better caching
          vendor: ['vue', 'vue-router', 'pinia', 'axios'],
          ui: ['@oruga-ui/oruga-next', '@oruga-ui/theme-bulma', 'bulma'],
          mapping: ['mapbox-gl', '@deck.gl/core', '@luma.gl/core'],
          utils: ['lodash-es', 'proj4', 'reproject']
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 8080,
    open: true,
    cors: true
  },
  preview: {
    port: 4173,
    open: true
  },
  // Enable modern CSS features
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: { additionalData: `@import "./src/assets/sass/variables.scss";` }
    }
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version)
  },
  // Optimize deps
  optimizeDeps: {
    include: [
      'vue',
      'vue-router', 
      'pinia',
      'axios',
      'lodash-es',
      '@deck.gl/core',
      'mapbox-gl'
    ]
  },
  // Modern transpilation
  esbuild: {
    target: 'esnext'
  }
})