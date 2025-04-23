import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  // config options
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        tools: resolve(__dirname, 'tools.html'),
      },
    },
  },
})
