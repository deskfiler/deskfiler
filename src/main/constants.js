const { app } = require('electron');
const path = require('path');

const isIt = require('./utils/whichEnvIsIt');

/* Directories */
const DESKFILER_DIR = app.getPath('userData');
const APP_DIR =  app.getAppPath();
const HOME_DIR = app.getPath('home');
const PLUGINS_DIR = path.join(DESKFILER_DIR, 'plugins');
const LOGS_DIR = path.join(DESKFILER_DIR, 'logs');
const TEMP_DIR = path.join(app.getPath('temp'), 'deskfiler');

// Port on which serve server should start
const PORT = 4400;

// Path to preloads directory
const PRELOADS_DIR = isIt('development').env
  ? path.join(__dirname, 'preloads')
  : path.join(__dirname);

// List of plugins to preinstall on first launch
const PREPACKED_PLUGINS = ['gVision', 'imageTagViewer', 'zipPw', 'weTransferConnect', 'pdfSplitter'];

module.exports = {
  PLUGINS_DIR,
  LOGS_DIR,
  TEMP_DIR,
  PRELOADS_DIR,
  DESKFILER_DIR,
  PREPACKED_PLUGINS,
  HOME_DIR,
  APP_DIR,
  PORT,
};
