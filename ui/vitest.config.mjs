import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      api: path.resolve(__dirname, './src/api'),
      stores: path.resolve(__dirname, './src/stores')
    }
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.spec.js']
  }
})
