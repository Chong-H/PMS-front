import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // base: "/", 
  //for apk
  base: "./",
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    
    host: process.env.TAURI_DEV_HOST || "0.0.0.0",
    port: 3399, // 可以指定端口，如果需要
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:1233',
        changeOrigin: true
      }
    }
  }
})
