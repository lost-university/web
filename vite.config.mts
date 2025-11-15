import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [vue(), tailwindcss(), VitePWA({
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true,
    },
    includeAssets: ['*.png', '*.jpg'],
    workbox: {
      maximumFileSizeToCacheInBytes: 5 * 1024 ** 2, // 5 MB
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/raw\.githubusercontent\.com\/.*\.json$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'github-json',
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 60 * 60 * 24 * 7
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    },
    manifest: {
      name: 'Lost',
      short_name: 'Lost',
      start_url: '/',
      display: 'standalone',
      theme_color: '#8c195f',
      display_override: 'Semester Scheduler',
      icons: [
        {
          src: '/icons/ostlogo192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icons/ostlogo512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  })],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\//, ''),
      },
    },
  },
});
