const {
  app,
  ipcMain,
  protocol,
  BrowserWindow,
  webContents,
} = require('electron');

const { dissoc } = require('ramda');
const fs = require('fs');
const path = require('path');
const util = require('util');
const http = require('http');
const childProcess = require('child_process');

const mkdirp = require('mkdirp');
const rmrf = require('rimraf');

const tar = require('tar');
const handler = require('serve-handler');

const store = require('./store');
const log = require('./log');
const baseUrl = require('./baseUrl');
const isIt = require('./utils/whichEnvIsIt');
const {
  HOME_DIR,
  PLUGINS_DIR,
  /* PREPACKED_PLUGINS, */
  PRELOADS_DIR,
  TEMP_DIR,
  LOGS_DIR,
  PORT,
} = require('./constants');

let mainWindow;
let pluginControllerWindow;
let pluginConfigWindow;
let registerWindow;
let loginWindow;
let paymentWindow;

const rimraf = util.promisify(rmrf);

let server = null;

app.setAsDefaultProtocolClient('deskfiler');

mkdirp.sync(LOGS_DIR);

async function createPluginControllerWindow({
  pluginKey,
  allowedExtensions,
  inDevelopment,
  devPluginUrl,
  filePaths,
  showOnStart,
  ticket,
}) {
  pluginControllerWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    show: showOnStart,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  pluginControllerWindow.removeMenu();

  await pluginControllerWindow.loadURL(path.join(baseUrl, 'public', 'plugin.html'));
  if (process.env.NODE_ENV === 'development') {
    pluginControllerWindow.webContents.openDevTools();
  }

  pluginControllerWindow.webContents.send('new-plugin-loaded', {
    pluginKey,
    allowedExtensions,
    inDevelopment,
    devPluginUrl,
    filePaths,
    ticket,
    mainId: mainWindow.webContents.id,
    selfId: pluginControllerWindow.webContents.id,
  });

  pluginControllerWindow.on('closed', async () => {
    pluginControllerWindow = null;
    const plugin = await store.get(`pluginData.${pluginKey}`);
    store.set(`pluginData.${pluginKey}`, {
      ...plugin,
      isWorking: false,
    });
  });
}

async function createPaymentWindow({ fromId, userId }) {
  paymentWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, '/preloads/paymentPreload.js'),
    },
  });

  await paymentWindow.loadURL(`https://plugins.deskfiler.org/tickets.php/gvision/${userId}`, {
    extraHeaders: 'Authorization: Basic YTpi',
  });

  ipcMain.once('payment-recieved', () => {
    log(`payment recieved from user ${userId}`);
    webContents.fromId(fromId).send('payment-recieved');
  });

  if (process.env.NODE_ENV === 'development') {
    paymentWindow.webContents.openDevTools();
  }

  paymentWindow.on('closed', () => {
    paymentWindow = null;
  });
}

async function createRegisterWindow() {
  log('creating login window');

  const preloadName = `registerPreload${isIt('production').env ? '.prod' : ''}.js`;

  const preload = `${path.join(PRELOADS_DIR, preloadName)}`;

  log('preload', preload);

  registerWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      preload,
    },
  });

  registerWindow.removeMenu();

  await registerWindow.loadURL('http://plugins.deskfiler.org/register.php?hidehead=yes', {
    extraHeaders: 'Authorization: Basic YTpi',
  });

  if (process.env.NODE_ENV === 'development') {
    registerWindow.webContents.openDevTools();
  }

  registerWindow.on('closed', () => {
    registerWindow = null;
  });
}

async function createLoginWindow() {
  log('creating login window');

  const preloadName = `loginPreload${isIt('production').env ? '.prod' : ''}.js`;

  const preload = `${path.join(PRELOADS_DIR, preloadName)}`;

  log('preload', preload);

  loginWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      preload,
    },
  });

  loginWindow.removeMenu();

  await loginWindow.loadURL('https://plugins.deskfiler.org/?hidehead=yes&hideinfo=yes&json=yes');

  if (process.env.NODE_ENV === 'development') {
    loginWindow.webContents.openDevTools();
  }

  loginWindow.on('closed', () => {
    loginWindow = null;
  });
}

async function createPluginConfigWindow({ pluginKey }) {
  pluginConfigWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  pluginConfigWindow.removeMenu();

  await pluginConfigWindow.loadURL(path.join(baseUrl, 'public', 'config.html'));

  if (process.env.NODE_ENV === 'development') {
    pluginConfigWindow.webContents.openDevTools();
  }

  pluginConfigWindow.webContents.send('new-config-loaded', {
    pluginKey,
    mainId: mainWindow.webContents.id,
    selfId: pluginConfigWindow.webContents.id,
  });

  pluginConfigWindow.on('closed', () => {
    pluginConfigWindow = null;
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 700,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  mainWindow.removeMenu();

  mainWindow.loadURL(path.join(baseUrl, 'public', 'index.html'));

  if (process.platform === 'win32') {
    let resizeTimeout;
    mainWindow.on('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const size = mainWindow.getSize();
        mainWindow.setSize(size[0], parseInt(size[0] * 3 / 4, 10));
      }, 100);
    });
  } else {
    const defaultRatio = 4 / 3;
    mainWindow.setAspectRatio(defaultRatio);
  }

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  store.onDidChange('pluginData', (newData) => {
    log('plugins store changed');
    mainWindow.webContents.send('plugins-store-updated', newData);
  });

  const settings = await store.get('settings');

  if (!settings) {
    store.set('settings', {
      general: {
        masterPin: 'admin',
        runOnStartUp: false,
        language: 'english',
        defaultStoragePath: HOME_DIR,
        skipRegistration: false,
      },
    });
  }

  const unpackPlugin = async (filePath) => {
    log('unpacking plugin', filePath);

    try {
      await mkdirp(TEMP_DIR);

      log('created temporary directory', TEMP_DIR);

      log('unpacking plugin manifest...');

      await tar.x({
        file: filePath,
        cwd: TEMP_DIR,
      }, ['manifest.json']);

      log('unpacked');

      const manifest = fs.readFileSync(path.join(TEMP_DIR, 'manifest.json'), 'utf8');

      log('found plugin manifest', manifest);

      await rimraf(TEMP_DIR);

      log('removed temporary directory');

      const manifestData = JSON.parse(manifest);

      const {
        name,
        author,
        version,
        icon,
        legallink,
        legalhint,
        executablesDir = 'executables',
        settings: pluginSettings,
        acceptRestrictions,
      } = manifestData;

      const pluginKey = name.trim().replace(/\s/g, '-').toLowerCase();

      log('generated plugin key', pluginKey);


      log('waiting for install confirmation...');

      const dirPath = path.join(PLUGINS_DIR, pluginKey);

      await mkdirp(dirPath);

      log('created plugin directory', dirPath);

      log('unpacking plugin...');

      await tar.x({
        file: filePath,
        cwd: dirPath,
      });

      log('plugin unpacked');

      const escapeSpaces = p => p.replace(/(\s+)/g, '\\$1');
      const pathToExecutables = path.join(PLUGINS_DIR, pluginKey, executablesDir);
      if (process.platform !== 'win32' && fs.existsSync(pathToExecutables)) {
        childProcess.exec(`chmod -R 777 ${escapeSpaces(pathToExecutables)}`, (err) => {
          if (err) {
            throw new Error(err);
          }
          log('set permissions for plugin directory');
        });
      }

      log('getting plugin copy if already installed');

      const pluginDataCopy = await store.get(`pluginData.${pluginKey}`);

      store.set(`pluginData.${pluginKey}`, {
        key: pluginKey,
        name,
        icon,
        isInstalling: true,
      });

      log('added plugin to plugins list');

      mainWindow.webContents.send('unpacked-plugin', {
        pluginKey,
        name,
        author,
        version,
        icon,
        legallink,
        legalhint,
      });

      await new Promise((resolve, reject) => {
        ipcMain.once('continue-plugin-installation', (e, { shouldContinue }) => {
          if (shouldContinue) {
            resolve();
          } else {
            log('installation cancelled by user');
            if (pluginDataCopy) {
              store.set(`pluginData.${pluginKey}`, pluginDataCopy);
            } else {
              store.delete(`pluginData.${pluginKey}`);
            }
            reject(new Error('Installation Cancelled'));
          }
        });
      });

      log('install confirmed');

      if (pluginSettings) {
        log('found settings definition in manifest', pluginSettings);

        const getSettingsFromSections = sections => sections.reduce((acc, section) => {
          const sectionSettings = section.children.reduce((prev, { name: n, value }) => ({
            ...prev,
            [n]: value,
          }), {});

          return { ...sectionSettings, ...acc };
        }, {});

        log('writing settings to store...');

        store.set('settings', {
          ...settings,
          [pluginKey]: getSettingsFromSections(pluginSettings),
        });

        log('done');
      }


      const logFile = path.join(LOGS_DIR, `${pluginKey}-logs.json`);

      log(`checking whether log file exists for plugin ${pluginKey}`);

      const logFileExists = fs.existsSync(logFile);

      if (!logFileExists) {
        log(`no log file found, creating ${logFile}`);
        fs.writeFileSync(logFile, '[]');
        log('created');
      }

      log('plugin installed!');

      store.set(`pluginData.${pluginKey}`, {
        key: pluginKey,
        name,
        author,
        version,
        icon,
        pluginSettings,
        acceptRestrictions,
        isInstalling: false,
        isWorking: false,
      });
      return manifestData;
    } catch (err) {
      console.log(err);
      log('error during installation', err);
      return null;
    }
  };

  ipcMain.on('recieved-plugin-tarball', async (event, filePath) => {
    try {
      await unpackPlugin(filePath);
    } catch (err) {
      console.log(err);
    }
  });

  /* TODO: implement preinstalled plugins feature. Right now stuck on a way to
   * copy plugin tarballs into the actual distributable. copy-webpack-plugin don't
   * work for some reason. Specifying them in package.json > build > files don't
   * work either. */

  /* const installPromises = [];

  for (const plugin of PREPACKED_PLUGINS) {
    const filePath = path.join(__dirname, `${plugin}.tar.gz`);

    log('installing prepacked plugin', plugin, 'filePath', filePath);

    installPromises.push(unpackPlugin(filePath))
  }

  Promise.all(installPromises).then(() => log('installed!')) */

  ipcMain.on('open-plugin-controller-window', async (event, {
    pluginKey,
    inDevelopment,
    devPluginUrl,
    filePaths,
    ticket,
  }) => {
    const restrictions = await store.get(`pluginData.${pluginKey}.acceptRestrictions`);
    createPluginControllerWindow({
      pluginKey,
      inDevelopment,
      devPluginUrl,
      allowedExtensions: (restrictions && restrictions.ext) || null,
      filePaths,
      showOnStart: false,
      ticket,
    });
  });

  ipcMain.on('open-plugin-config-window', (event, pluginKey) => {
    createPluginConfigWindow({ pluginKey });
  });

  ipcMain.on('open-payment-window', (event, { fromId, userId }) => {
    if (!paymentWindow) {
      createPaymentWindow({ fromId, userId });
    } else {
      paymentWindow.show();
    }
  });

  ipcMain.on('open-register-window', () => {
    if (!registerWindow) {
      createRegisterWindow();
    } else {
      registerWindow.show();
    }
  });

  ipcMain.on('open-login-window', () => {
    log('opening login window');
    if (!loginWindow) {
      createLoginWindow();
    } else {
      loginWindow.show();
    }
  });

  ipcMain.on('logged-in', (event, user) => {
    log('logged in as', user.email);
    store.set('user', user);
    mainWindow.webContents.send('logged-in');
  });

  ipcMain.on('send-auth-token', (event, token) => {
    log('got auth token', token);
  });

  ipcMain.on('manifest-delete-all', async () => {
    try {
      store.delete('pluginData');
      await rimraf(path.join(process.cwd(), 'installed-plugins'));
      await mkdirp(path.join(process.cwd(), 'installed-plugins'));
      if (pluginControllerWindow) {
        pluginControllerWindow.close();
        pluginControllerWindow = null;
      }
    } catch (err) {
      console.log(err);
    }
  });

  ipcMain.on('remove-plugin', async (e, pluginKey) => {
    log(`removing plugin ${pluginKey} requested`);
    try {
      const plugins = await store.get('pluginData');

      log(`deleting ${pluginKey} from store...`);
      store.set('pluginData', dissoc(pluginKey, plugins));

      log('done');

      log(`deleting ${pluginKey} from physical disk...`);
      await rimraf(path.join(process.cwd(), 'installed-plugins', pluginKey));

      log('done');

      if (pluginControllerWindow) {
        pluginControllerWindow.close();
        pluginControllerWindow = null;
      }
    } catch (err) {
      console.log(err);
    }
  });

  mainWindow.on('closed', () => {
    server.close(() => { console.log('Server closed.'); });
    mainWindow = null;
  });
}

ipcMain.on('clear-local-cache', async (e) => {
  const cachedir = app.getPath('userData');

  log('Removing cache...');

  await rimraf(cachedir);

  log('Done, cleared the cache. Sending message to renderer to reload...');

  e.reply('local-cache-cleared');
});

ipcMain.on('restart-app', () => {
  app.relaunch();
});

const isSingleAppInstance = app.requestSingleInstanceLock();

if (!isSingleAppInstance) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.on('activate', () => {
    if (mainWindow === null) createWindow();
  });

  app.on('ready', () => {
    log('App ready, creating window...');

    createWindow();

    log('Created main-renderer window, registering protocol...');

    protocol.registerStringProtocol('deskfiler', (request, callback) => {
      log('Registered deskfiler:// protocol');

      callback();
    });

    log('Initializing serve for plugins');

    server = http.createServer((request, response) => (
      handler(request, response, {
        public: PLUGINS_DIR,
      })
    ));

    server.listen(PORT, () => {
      log(`Hosting plugins @ http://localhost:${PORT}.`);
    });
  });

  app.on('login', (event, _, request, authInfo, callback) => {
    event.preventDefault();
    callback('a', 'b');
  });

  app.on('window-all-closed', () => {
    server.close(() => { log('Plugins server closed.'); });
    log('Terminating app...');
    if (process.platform !== 'darwin') app.quit();
  });
}
