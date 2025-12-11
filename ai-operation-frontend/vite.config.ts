import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // 代理TikHub API请求，解决CORS问题
      '/tikhub-api': {
        target: 'https://api.tikhub.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tikhub-api/, ''),
        secure: true,
      },
    },
  },
})
