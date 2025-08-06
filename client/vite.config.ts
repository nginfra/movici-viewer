import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { compression } from 'vite-plugin-compression2'
import { visualizer } from 'rollup-plugin-visualizer'
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
    }),
    // Compression for production builds
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$ /, /\.(gz)$/]
    }),
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$ /, /\.(gz)$/]
    }),
    // Bundle analyzer (only in analyze mode)
    process.env.ANALYZE && visualizer({
      filename: 'dist/bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@movici-flow-lib': fileURLToPath(new URL('./movici-flow-lib/src', import.meta.url))
    }
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    // Enable module preloading for better performance
    modulePreload: true,
    rollupOptions: {
      output: {
        // Enhanced chunk splitting strategy
        manualChunks: (id) => {
          // Vendor libraries
          if (id.includes('vue') || id.includes('pinia') || id.includes('axios')) {
            return 'vendor'
          }
          // UI framework chunks
          if (id.includes('@oruga-ui') || id.includes('bulma')) {
            return 'ui'
          }
          // Large mapping libraries
          if (id.includes('mapbox-gl') || id.includes('@deck.gl') || id.includes('@luma.gl')) {
            return 'mapping'
          }
          // Utility libraries
          if (id.includes('lodash') || id.includes('proj4') || id.includes('reproject')) {
            return 'utils'
          }
          // Chart libraries
          if (id.includes('chart.js') || id.includes('chartjs')) {
            return 'charts'
          }
          // Node modules that don't fit above categories
          if (id.includes('node_modules')) {
            return 'vendor-misc'
          }
        }
      }
    },
    // Increase chunk size warning limit for complex apps
    chunkSizeWarningLimit: 1500,
    // Enable minification optimizations
    minify: 'esbuild',
    // Reduce bundle size
    reportCompressedSize: false
  },
  server: {
    port: 8080,
    open: true,
    cors: true,
    // Performance optimizations for development
    hmr: {
      overlay: false // Disable error overlay for better performance
    },
    fs: {
      // Allow serving files from node_modules
      allow: ['..']
    }
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
  // Optimize dependencies for better dev performance
  optimizeDeps: {
    include: [
      'vue',
      'vue-router', 
      'pinia',
      'axios',
      'lodash-es',
      '@deck.gl/core',
      'mapbox-gl',
      '@oruga-ui/oruga-next',
      'chart.js',
      'proj4'
    ],
    // Force optimize heavy dependencies
    force: true
  },
  // Modern transpilation with optimizations
  esbuild: {
    target: 'esnext',
    // Enable tree shaking for smaller bundles
    treeShaking: true,
    // Optimize for modern browsers
    supported: {
      'top-level-await': true
    }
  },
  // Enable web workers
  worker: {
    format: 'es'
  },
  // Experimental features for better performance
  experimental: {
    renderBuiltUrl: (filename: string) => {
      // Optimize asset URLs for CDN usage if needed
      return `/${filename}`
    }
  }
})