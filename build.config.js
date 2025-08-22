/**
 * Build Configuration untuk DIGCITY Website
 * Memastikan build process berjalan dengan benar untuk deployment
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: []
      }
    })
  ],
  base: '/',
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './src')
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemap in production
    minify: 'terser',
    target: 'es2020',
    cssCodeSplit: false, // Disable CSS code splitting to avoid MIME type issues
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.');
          if (!info) return 'assets/[name][extname]';
          const extType = info[info.length - 1];
          
          // Handle images from public folder - keep them in root
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `[name][extname]`;
          }
          
          // Handle CSS files
          if (/css/i.test(extType)) {
            return `assets/css/[name][extname]`;
          }
          
          // Handle font files
          if (/woff2?|eot|ttf|otf/i.test(extType)) {
            return `assets/fonts/[name][extname]`;
          }
          
          // Handle JS files
          if (/js|tsx?/i.test(extType)) {
            return `assets/js/[name][extname]`;
          }
          
          return `assets/[name][extname]`;
        },
        chunkFileNames: 'assets/js/[name].js',
        entryFileNames: 'assets/js/[name].js'
      },
      // Enable tree shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      }
    },
    chunkSizeWarningLimit: 1000
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
    exclude: ['@vite/client', '@vite/env']
  },
  server: {
    port: 3000,
    host: true,
    open: false,
    cors: true,
    hmr: {
      overlay: true,
      port: 24678,
      clientPort: 24678
    },
    fs: {
      strict: true
    },
    middlewareMode: false,
    headers: {
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  },
  preview: {
    port: 4173,
    host: true,
    cors: true,
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Content-Type': 'text/html; charset=utf-8'
    }
  },
  // Enable esbuild optimizations
  esbuild: {
    // Remove console logs in production
    drop: ['console', 'debugger'],
    // Optimize for modern browsers
    target: 'es2020',
    // Enable tree shaking
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    legalComments: 'none',
    format: 'esm'
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || 'unknown'),
    'process.env.NODE_ENV': JSON.stringify('production')
  }
});
