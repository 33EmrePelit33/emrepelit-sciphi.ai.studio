import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.ico',
          'apple-touch-icon.png',
          'icon.svg',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png',
          'sciphil-app-icon.jpg',
        ],
        manifest: {
          id: '/',
          name: 'Emre Pelit — Sci-Phil Ana Hub & 301 Akademik Ağı',
          short_name: 'Sci-Phil',
          description:
            'Emre Pelit Bilim ve Felsefe (Sci-Phil) Ana Hub Platformu: 316 Özgün Makale, Önceki Bilimsel Araştırmalar & Yerleşik Kabuller, Simülasyon Laboratuvarı, 12 Dil Seslendirici ve 10 Resmi 301 Ağı.',
          theme_color: '#1E3A8A',
          background_color: '#0F172A',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          lang: 'tr',
          dir: 'ltr',
          categories: ['education', 'science', 'books', 'reference'],
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,woff,woff2}'],
          navigateFallback: null,
          runtimeCaching: [],
        },
        devOptions: {
          enabled: false,
          type: 'classic',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable standalone WebSocket server (port 24678) when HMR is disabled to prevent EADDRINUSE conflicts.
      ws: process.env.DISABLE_HMR === 'true' ? (false as const) : undefined,
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('/react-dom/') || id.includes('/react/') || id.includes('/scheduler/')) {
                return 'vendor-react';
              }
              if (id.includes('/firebase/') || id.includes('/@firebase/')) {
                return 'vendor-firebase';
              }
              if (id.includes('/katex/')) {
                return 'vendor-katex';
              }
              if (id.includes('/lucide-react/')) {
                return 'vendor-icons';
              }
              if (id.includes('/motion/') || id.includes('/framer-motion/')) {
                return 'vendor-motion';
              }
              return 'vendor-misc';
            }
            if (id.includes('/src/data/bloggerCorpusData')) {
              return 'corpus-archive-data';
            }
            if (id.includes('/src/data/initialData')) {
              return 'corpus-initial-data';
            }
            if (id.includes('/src/i18n/translations')) {
              return 'i18n-translations';
            }
            if (id.includes('/src/utils/articleAnalysisEngine')) {
              return 'engine-analysis';
            }
            if (id.includes('/src/utils/articleQaEngine')) {
              return 'engine-qa';
            }
            return undefined;
          },
        },
      },
    },
  };
});
