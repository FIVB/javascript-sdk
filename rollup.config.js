/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

import pkg from './package.json'
import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
// import globals from 'rollup-plugin-node-globals'
// import builtins from 'rollup-plugin-node-builtins'

export default [
  {
    input: 'src/index.js',

    output: [
      { file: pkg.main, format: 'cjs',  },
      { file: pkg.module, format: 'es' },
      { file: pkg.browser, format: 'umd', name: 'Fivb' }
    ],

    plugins: [
      // globals(),
      // builtins(),
      buble({
        exclude: ['node_modules/**'],
      }),
      resolve(),
      commonjs(),
    ]
  },
]
