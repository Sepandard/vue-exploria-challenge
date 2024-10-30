import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths';


// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tsconfigPaths()],
  server: {
    port: 8080
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use "./src/design/styles/common.scss" as *;
        `
      }
    }
  }
})
