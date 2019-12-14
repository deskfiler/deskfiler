/*
 * DESKFILER MAIN THREAD
 * Author: Ilya Lopukhin
 */
const {
  app,
  dialog,
  ipcMain,
  protocol,
} = require('electron');

const util = require('util');

const { autoUpdater } = require('electron-updater');

const mkdirp = require('mkdirp');
const rmrf = require('rimraf');

const log = require('./log');

const { LOGS_DIR } = require('./constants');

const {
  downloadPlugin,
} = require('./plugins');

const {
  getMainWindow,
  createMainWindow,
} = require('./windows');

const {
  closeServer,
  createServer,
} = require('./server');

const rimraf = util.promisify(rmrf);

// Set parameters for autoupdater
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

autoUpdater.autoDownload = false;

// Set custom 'deskfiler://' protocol as default 
if (!app.isDefaultProtocolClient('deskfiler')) {
  app.setAsDefaultProtocolClient('deskfiler');
}

// Create directory for plugin-produced logs
mkdirp.sync(LOGS_DIR);

// Clear local cache on error boundary
ipcMain.on('clear-local-cache', async (e) => {
  const cachedir = app.getPath('userData');

  log('Removing cache...');

  await rimraf(cachedir);

  log('Done, cleared the cache. Sending message to renderer to reload...');

  e.reply('local-cache-cleared');
});


// Handling app restart
ipcMain.on('restart-app', () => {
  app.relaunch();
});

// Restrict deskfiler instances to one at a time
const isSingleAppInstance = app.requestSingleInstanceLock();

// On second-instance focus and restore first one
if (!isSingleAppInstance) {
  app.quit();
} else {
  app.on('second-instance', (e, argv) => {
    const mainWindow = getMainWindow();

    if (mainWindow) {
      if (process.platform === 'win32') {  
        // On Windows, custom protocol url can be recieved through a argv argument
        const url = argv.slice(-1)[0];
        downloadPlugin(url, mainWindow);
      }

      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
  });

  // Restore application on relaunch from dock/taskbar
  app.on('activate', () => {
    const mainWindow = getMainWindow();
    if (mainWindow === null) createMainWindow();
  });

  // Event that shows that electron app is ready to work
  app.on('ready', async () => {
    log('App ready, creating window...');

    createMainWindow();

    log('Created main-renderer window, registering protocol...');

    // Register a custom protocol scheme 
    protocol.registerStringProtocol('deskfiler', (request, callback) => {
      callback();
    }, (err) => {
      if (err) {
        log('Error when registering deskfiler:// protocol', err);
        return;
      }
      log('Registered deskfiler:// protocol');
    });

    log('Initializing serve for plugins');

    // Start local server to host plugins
    createServer();

    log('Checking for updates...');

    // Offer user to download newest update if available
    autoUpdater.on('update-available', async (event) => {
      const { version } = event;

      log('found new version!', version, ' asking to download...');

      const { response } = await dialog.showMessageBox({
        type: 'question',
        title: `New update available (${version})`,
        message: 'Do you want to download update?',
        buttons: ['cancel', 'Download'],
      });

      if (response === 1) {
        log('user confirmed he wants to update, downloading...');
        await autoUpdater.downloadUpdate();
      }
    });

    // Offer user to install newest update
    autoUpdater.on('update-downloaded', async (event) => {
      const { version } = event;

      const { response } = await dialog.showMessageBox({
        type: 'question',
        title: `Update available (${version})`,
        message: 'Do you want to install update?',
        buttons: ['cancel', 'Quit and install'],
      });

      if (response === 1) {
        log('user confirmed he wants to install update, rerunning app...');
        await autoUpdater.quitAndInstall();
      }
    });

    await autoUpdater.checkForUpdates();
  });

  // Authorize user through basic auth
  app.on('login', (event, _, request, authInfo, callback) => {
    event.preventDefault();
    callback('a', 'b');
  });

  // On MacOS, custom protocol links work through the 'open-url' event
  app.on('open-url', (e, url) => {
    const mainWindow = getMainWindow();

    if (mainWindow) downloadPlugin(url, mainWindow);
  });

  // If all windows are closed - terminate the app on all platforms, except for MacOS
  app.on('window-all-closed', () => {
    closeServer();

    log('Terminating app...');
    if (process.platform !== 'darwin') app.quit();
  });
}
