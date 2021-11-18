import { terser as pluginTerser } from 'rollup-plugin-terser';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginNodeResolve from '@rollup/plugin-node-resolve';
import { babel as pluginBabel } from '@rollup/plugin-babel';
import * as path from 'path';

import pkg from './package.json';

const moduleName = 'W';
const inputFileName = 'src/index.js';

const banner = `
  /**
   * @license
   * ${moduleName}.js v${pkg.version}
   * Released under the ${pkg.license} License.
   */
`;

export default [
  {
    input: inputFileName,
    output: [
      // uncompressed
      {
        name: moduleName,
        file: pkg.browser,
        format: 'umd',
        sourcemap: 'inline',
        banner
      },
      // minified
      {
        name: moduleName,
        file: pkg.browser.replace('.js', '.min.js'),
        format: 'umd',
        sourcemap: 'inline',
        banner,
        plugins: [
          pluginTerser(),
        ],
      }
    ],
    plugins: [
      pluginCommonjs({
        extensions: ['.js'],
      }),
      pluginBabel({
        babelHelpers: 'bundled',
        configFile: path.resolve(__dirname, '.babelrc.js'),
      }),
      pluginNodeResolve({
        browser: true,
      }),
    ],
    external: [
      'window',
    ],
  },
];
