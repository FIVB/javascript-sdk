/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import pkg from './package.json'

export default [
  {
    input: 'src/index.js',
    output: [
      { file: 'dist/sdk.umd.js', format: 'umd', name: 'Fivb' },
    ],
    plugins: [
      json(),
      buble({
        exclude: ['node_modules/**'],
      }),
      resolve(),
      commonjs(),
      uglify({}, minify),
    ],
    globals: { 'node-fetch': 'fetch' },
    external: ['node-fetch'],
  },
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    plugins: [
      json(),
      buble({
        exclude: ['node_modules/**'],
        modules: false,
      }),
      commonjs(),
    ],
    external: ['isomorphic-unfetch', 'resetable'],
  },
]
