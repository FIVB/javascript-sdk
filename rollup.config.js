/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import pkg from './package.json'

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/sdk.umd.js',
      format: 'umd',
      name: 'Fivb',
      globals: { 'node-fetch': 'fetch' },
    },
    plugins: [
      json(),
      babel({
        exclude: 'node_modules/**',
      }),
      resolve(),
      commonjs(),
      uglify({}, minify),
    ],
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
      babel({
        exclude: 'node_modules/**',
      }),
      commonjs(),
    ],
    external: ['isomorphic-unfetch', 'resetable'],
  },
]
