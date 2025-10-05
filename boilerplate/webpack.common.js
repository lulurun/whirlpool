const path = require('path');
const webpack = require('webpack');
const webpackTerser = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const distDir = './public';

module.exports = {
  entry: [
    './src/js/index.js'
  ],
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [distDir],
    }),
    new HtmlWebpackPlugin({
      title: 'Whirlpool Starter',
      template: './src/html/index.html',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
  ],
  optimization: {
    minimizer: [
      new webpackTerser({
        extractComments: 'some',
        terserOptions: {
          compress: {
            drop_console: false,
          },
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env' ],
          }
        }
      },
      { test: /\.html$/, use: 'handlebars-loader' },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, distDir),
  },
}