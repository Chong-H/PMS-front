import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    
    host: '0.0.0.0', // 允许局域网访问
    port: 3399, // 可以指定端口，如果需要
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:1233',
        changeOrigin: true
      }
    }
  }
})
