const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { spawn } = require('child_process');
const Dotenv = require('dotenv-webpack');

const config = require('./webpack.renderer.base.js');

const plugins = [
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
    'process.env.NODE_ENV': JSON.stringify('development'),
  }),
  new HtmlWebpackPlugin({
    template: path.resolve('src', 'install-modal-window', 'index.tpl.html'),
    inject: 'body',
    filename: 'public/install-modal-window.html',
    chunks: ['installModal'],
  }),
  new Dotenv(),
];

module.exports = env => merge(config(env), {
  mode: 'development',
  plugins,
  devtool: 'cheap-source-map',
  output: {
    path: path.join(__dirname, 'src', 'dist'),
    publicPath: '/',
    filename: '[name].js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'resources'),
    hot: true,
    hotOnly: true,
    stats: {
      colors: true,
      chunks: false,
      children: false,
    },
    before() {
      spawn(
        'electron',
        ['.'],
        { shell: true, env: process.env, stdio: 'inherit' },
      )
        .on('close', code => process.exit(0))
        .on('error', spawnError => console.error(spawnError));
    },
  },
});
