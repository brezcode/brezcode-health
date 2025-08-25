import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: false,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3011',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
      { find: '@components', replacement: '/src/components' },
      { find: '@features', replacement: '/src/features' },
      { find: '@hooks', replacement: '/src/hooks' },
      { find: '@lib', replacement: '/src/lib' },
      { find: '@styles', replacement: '/src/styles' },
      { find: '@assets', replacement: '/src/assets' },
    ],
  },
})
