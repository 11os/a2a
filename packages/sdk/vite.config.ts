import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'mq',
      fileName: (m) => `index.${m}.js`,
      formats: ['es', 'umd', 'cjs']
    }
  },
  plugins: [
    dts({
      staticImport: true,
      insertTypesEntry: true,
      logDiagnostics: true
    })
  ]
})
