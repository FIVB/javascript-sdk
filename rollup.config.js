/**
 * fivb-sdk
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

import pkg from './package.json'
import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'
// import globals from 'rollup-plugin-node-globals'
import resolve from 'rollup-plugin-node-resolve'
// import builtins from 'rollup-plugin-node-builtins'

export default [
  {
    input: 'src/index.js',

    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
      { file: pkg.browser, format: 'umd', name: 'Fivb' }
    ],

    externals: ['buffer-es6'],

    plugins: [
      // globals(),
      // builtins(),
      buble({
        exclude: ['node_modules/**'],
      }),
      resolve({
        module: true,
        jsnext: true,
        main: true,
        preferBuiltins: false,
      }),
      commonjs({
        include: 'node_modules/**',
        // namedExports: {
        //   'rollup-plugin-node-builtins': ['StringDecoder'],
        //   // 'buffer-es6': ['INSPECT_MAX_BYTES', 'kMaxLength', 'Buffer', 'SlowBuffer', 'isBuffer'],
        // },
      }),
    ]
  },
]
