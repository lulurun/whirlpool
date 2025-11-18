const path = require('path');
const webpack = require('webpack');
const webpackTerser = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const distDir = './public';
const whirlpoolDist = path.resolve(__dirname, '../../dist/whirlpool.min.js');

module.exports = {
  entry: [
    './src/js/index.js'
  ],
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [distDir],
    }),
    new HtmlWebpackPlugin({
      title: 'Trading Order Book',
      template: './src/html/index.html',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: whirlpoolDist,
          to: path.resolve(__dirname, distDir, 'whirlpool.min.js'),
        },
      ],
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
            presets: ['@babel/preset-env'],
          }
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: 'handlebars-loader',
          options: {
            helperDirs: [path.resolve(__dirname, 'src/js/helpers')]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, distDir),
  },
};
