const path = require('path');

module.exports = () => ({
  entry: {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, 'src', 'main-renderer', 'index.jsx'),
    ],
    pluginController: [
      path.join(__dirname, 'src', 'plugin-controller', 'index.js'),
    ],
    pluginConfig: [
      path.join(__dirname, 'src', 'plugin-config', 'index.jsx'),
    ],
    inputModal: [
      path.join(__dirname, 'src', 'input-modal', 'index.jsx'),
    ],
    loginPreload: [
      path.join(__dirname, 'src', 'main', 'preloads', 'loginPreload.js'),
    ],
    registerPreload: [
      path.join(__dirname, 'src', 'main', 'preloads', 'registerPreload.js'),
    ],
    installModal: [
      path.join(__dirname, 'src', 'install-modal-window', 'index.js'),
    ],
  },
  output: {
    path: path.join(__dirname, 'src', 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.join(__dirname, 'src', 'main-renderer'), 'node_modules', path.join(__dirname, 'src', 'node_modules')],
    alias: {
      store: path.join(__dirname, 'src', 'main', 'store'),
    },
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
            plugins: [
              '@babel/plugin-proposal-export-namespace-from',
              '@babel/plugin-proposal-export-default-from',
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-syntax-dynamic-import',
              '@babel/plugin-proposal-do-expressions',
              [
                // used only for babel helpers
                '@babel/plugin-transform-runtime',
                {
                  // regenerator runtime should be used from global polyfill
                  regenerator: false,
                  // define babel helpers as es modules
                  useESModules: true,
                },
              ],
              [
                'babel-plugin-styled-components',
                {
                  displayName: true,
                },
              ],
            ],
            env: {
              development: {
                plugins: [
                  'react-hot-loader/babel',
                ],
              },
            },
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
      // WOFF/WOFF2 Fonts
      {
        test: /\.woff(.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
          },
        },
      },
      // TTF Fonts
      {
        test: /\.ttf(.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream',
          },
        },
      },
      // SVG
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
        test: /\.png(.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/png',
          },
        },
      },
      // Common Image Formats
      {
        test: /\.(?:ico|gif|jpg|jpeg|eot|webp)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
  target: 'electron-renderer',
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
