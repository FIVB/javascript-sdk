/**
 * @fivb/sdk
 *
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */

import uglify from 'rollup-plugin-uglify'
import commonjs from 'rollup-plugin-commonjs'

export default [
  // UMD Bundle
  {
    input: 'dist/esm/index.js',
    output: {
      file: 'dist/umd/sdk.umd.js',
      format: 'umd',
      name: 'Fivb',
    },
    plugins: [
      commonjs(),
      uglify(),
    ],
  },
]
