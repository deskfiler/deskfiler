const ArchivePlugin = require('webpack-archive-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './index.js',
  target: 'node',
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '..', '..', 'plugins-dist', 'gVision'),
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
        test: /\.svg(.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml',
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
        from: 'icon.svg',
      },
    ]),
    new ArchivePlugin({
      format: 'tar',
      output: path.join(__dirname, '..', '..', 'plugins-dist', 'gVision'),
    }),
  ],
};
