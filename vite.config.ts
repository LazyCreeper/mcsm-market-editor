// Plugins
import Components from 'unplugin-vue-components/vite'
import Vue from '@vitejs/plugin-vue'
import Fonts from 'unplugin-fonts/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import tailwindcss from '@tailwindcss/vite'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5175
  },
  plugins: [
    Vue(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false // css in js
        })
      ]
    }),
    Fonts({
      // TODO: MiSans
    }),
    tailwindcss(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        'pinia',
        {
          axios: [['default', 'axios']]
        }
      ],
      dts: 'src/auto-imports.d.ts'
    })
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue']
  },
  css: {
    preprocessorOptions: {
      sass: {
        // api: 'modern-compiler'
      },
      scss: {
        // api: 'modern-compiler'
      }
    }
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1024,
    cssCodeSplit: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          function containsArrayItem(str: string, arr: string[]) {
            return arr.some((item) => RegExp(item).test(str))
          }

          const itemsToCheck = ['axios/', 'lodash/', 'marked/', 'dayjs/']

          if (containsArrayItem(id, itemsToCheck)) return 'vendor'
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames(assetInfo) {
          if (assetInfo.name?.endsWith('.css')) return 'assets/css/[name]-[hash].css'

          const imgExts = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']
          if (imgExts.some((ext) => assetInfo.name?.endsWith(ext)))
            return 'assets/img/[name]-[hash].[ext]'

          return 'assets/[name]-[hash].[ext]'
        }
      }
    }
  }
})

