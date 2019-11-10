const { app } = require('electron');
const path = require('path');

const isIt = require('./utils/whichEnvIsIt');

/* Directories */
const DESKFILER_DIR = app.getPath('userData');
const HOME_DIR = app.getPath('home');
const PLUGINS_DIR = path.join(DESKFILER_DIR, 'plugins');
const LOGS_DIR = path.join(DESKFILER_DIR, 'logs');
const TEMP_DIR = path.join(app.getPath('temp'), 'deskfiler');

const PORT = 4400;

const PRELOADS_DIR = isIt('development').env
  ? path.join(__dirname, 'preloads')
  : path.join(__dirname);

module.exports = {
  PLUGINS_DIR,
  LOGS_DIR,
  TEMP_DIR,
  PRELOADS_DIR,
  DESKFILER_DIR,
  HOME_DIR,
  PORT,
};
