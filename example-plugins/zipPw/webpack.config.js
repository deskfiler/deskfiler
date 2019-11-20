const ArchivePlugin = require('webpack-archive-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const PermissionsOutputPlugin = require('webpack-permissions-plugin');
const path = require('path');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './index.js',
  target: 'node',
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '..', '..', 'plugins-dist', 'zipPw'),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            cacheDirectory: false,
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    electron: '4.1.4',
                  },
                  modules: false,
                  useBuiltIns: 'entry',
                },
              ],
              [
                '@babel/preset-react',
                {
                  development: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.(css)$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  node: {
    console: true,
  },
  plugins: [
    new CopyPlugin([
      {
        from: 'manifest.json',
      },
      {
        from: 'node_modules/7zip-bin/linux',
        to: '7zip-bin/linux',
        flatten: true,
      },
      {
        from: 'node_modules/7zip-bin/mac',
        to: '7zip-bin/mac',
        flatten: true,
      },
      {
        from: 'node_modules/7zip-bin/win/ia32',
        to: '7zip-bin/win/ia32',
        flatten: true,
      },
      {
        from: 'node_modules/7zip-bin/win/x64',
        to: '7zip-bin/win/x64',
        flatten: true,
      },
      {
        from: 'webicon.svg',
      },
    ]),
    new ArchivePlugin({
      format: 'tar',
      output: path.join(__dirname, '..', '..', 'plugins-dist', 'zipPw'),
    }),
  ],
};
