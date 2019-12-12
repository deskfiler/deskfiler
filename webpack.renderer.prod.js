const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const config = require('./webpack.renderer.base.js');

const plugins = [
  new CopyPlugin([
    {
      from: path.join(__dirname, 'plugins-dist', 'gVision.tar.gz'),
      to: path.join(__dirname, 'dist', 'plugins'),
    },
    {
      from: path.join(__dirname, 'plugins-dist', 'imageTagViewer.tar.gz'),
      to: path.join(__dirname, 'dist', 'plugins'),
    },
    {
      from: path.join(__dirname, 'plugins-dist', 'zipPw.tar.gz'),
      to: path.join(__dirname, 'dist', 'plugins'),
    },
    {
      from: path.join(__dirname, 'plugins-dist', 'pdfSplitter.tar.gz'),
      to: path.join(__dirname, 'dist', 'plugins'),
    },
    {
      from: path.join(__dirname, 'plugins-dist', 'weTransferConnect.tar.gz'),
      to: path.join(__dirname, 'dist', 'plugins'),
    },
  ]),
  new HtmlWebpackPlugin({
    template: path.resolve('src', 'main-renderer', 'index.tpl.html'),
    inject: 'body',
    filename: 'public/index.html',
    chunks: ['app'],
  }),
  new HtmlWebpackPlugin({
    template: path.resolve('src', 'plugin-controller', 'index.tpl.html'),
    inject: 'body',
    filename: 'public/plugin.html',
    chunks: ['pluginController'],
  }),
  new HtmlWebpackPlugin({
    template: path.resolve('src', 'input-modal', 'index.tpl.html'),
    inject: 'body',
    filename: 'public/inputModal.html',
    chunks: ['inputModal'],
  }),
  new HtmlWebpackPlugin({
    template: path.resolve('src', 'plugin-config', 'index.tpl.html'),
    inject: 'body',
    filename: 'public/config.html',
    chunks: ['pluginConfig'],
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  new Dotenv(),
];


module.exports = env => merge(config(env), {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'src', 'dist'),
    publicPath: '../',
    filename: '[name].prod.js',
  },
  plugins,
  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false,
  },
});
