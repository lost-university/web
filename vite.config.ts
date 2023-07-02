// import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  // todo: find vite/vue eslint plugin for ts
  plugins: [vue()],
});
