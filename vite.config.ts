import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf8'))
const APP_VERSION = pkg.version || '0.0.0'
const BUILD_TIME = new Date().toISOString()

export default defineConfig({
  plugins: [vue()],
  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION),
    __BUILD_TIME__: JSON.stringify(BUILD_TIME),
  },
  server: {
    port: 5174,
    fs: {
      allow: [
        resolve(__dirname),
        resolve(__dirname, '../../../GITHUB/ez-tree-1.1.0'),
      ],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8788',
        changeOrigin: true,
      },
      '/deepseek-api': {
        target: 'https://api.deepseek.com',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/deepseek-api/, ''),
      },
    },
  },
  optimizeDeps: {
    exclude: ['@dgreenheck/ez-tree'],
  },
  resolve: {
    dedupe: ['three'],
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
