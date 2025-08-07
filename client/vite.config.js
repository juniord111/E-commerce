import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://e-commerce-nw9h.onrender.com/api',
        changeOrigin: true,
      },
    },
     allowedHosts: ['bcfc7a76dbe9.ngrok-free.app'],
    host: '0.0.0.0',
  },
})
  