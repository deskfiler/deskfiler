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
    path: path.join(__dirname, '..', '..', 'plugins-dist', 'weTransferConnect'),
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
      output: path.join(__dirname, '..', '..', 'plugins-dist', 'weTransferConnect'),
    }),
  ],
};
