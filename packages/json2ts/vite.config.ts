import legacy from '@vitejs/plugin-legacy'
import reactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`
  },
  css: {
    modules: {
      generateScopedName: '[local]_[hash:base64:6]'
    }
  },
  plugins: [
    reactRefresh(),
    legacy({
      targets: ['iOS 9']
    })
  ],
  build: {
    target: 'es2015',
    minify: 'terser',
    rollupOptions: {
      output: {
        // manualChunks(id) {
        //   if (id.includes('antd-mobile')) {
        //     return 'adm'
        //   }
        // }
      }
    }
  }
})
