import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      babel: {
        plugins: []
      }
    }),
    // Custom plugin for image optimization
    {
      name: 'image-optimization',
      generateBundle(_options, bundle) {
        // Add image optimization hints
        Object.keys(bundle).forEach(fileName => {
          if (/\.(png|jpe?g|gif|svg)$/i.test(fileName)) {
            const asset = bundle[fileName];
            if (asset.type === 'asset') {
              // Add cache headers for images
              asset.fileName = asset.fileName.replace(/\.(\w+)$/, '-[hash].$1');
            }
          }
        });
      }
    }
  ],
  base: './',
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
    },
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
    minify: 'terser',
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.')
          if (!info) return 'assets/[name]-[hash][extname]'
          const extType = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/css/i.test(extType)) {
            return `assets/css/[name]-[hash][extname]`
          }
          if (/woff2?|eot|ttf|otf/i.test(extType)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
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
    drop: mode === 'production' ? ['console', 'debugger'] : [],
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
    'process.env.NODE_ENV': JSON.stringify(mode)
  }
}))
