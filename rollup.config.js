/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

import buble from 'rollup-plugin-buble'
import cleanup from 'rollup-plugin-cleanup'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

import pkg from './package.json'

export default [
  {
    input: 'src/index.js',

    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
      { file: pkg.browser, format: 'umd', name: 'Fivb' },
    ],

    plugins: [
      buble({
        exclude: ['node_modules/**'],
      }),
      resolve(),
      commonjs(),
      cleanup(),
    ],
  },
]
