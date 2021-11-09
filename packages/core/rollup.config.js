import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import del from 'rollup-plugin-delete'
import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.ts',
    output: [
      {
        name: 'index',
        file: pkg.main,
        format: 'cjs'
      },
      {
        name: 'index',
        file: pkg.module,
        format: 'es'
      }
    ],
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
      typescript(),
      del({
        targets: ['dist/*']
      })
    ]
  }
]
