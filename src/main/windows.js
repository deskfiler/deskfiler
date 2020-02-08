const {
  ipcMain,
  BrowserWindow,
  webContents,
} = require('electron');

const { dissoc } = require('ramda');
const path = require('path');
const util = require('util');

const mkdirp = require('mkdirp');
const rmrf = require('rimraf');

const debounce = require('debounce');
const store = require('./store');
const log = require('./log');
const baseUrl = require('./baseUrl');
const isIt = require('./utils/whichEnvIsIt');
const {
  HOME_DIR,
  PRELOADS_DIR,
} = require('./constants');

const {
  preinstallPlugins,
} = require('./plugins');

const { closeServer } = require('./server');

const rimraf = util.promisify(rmrf);

let mainWindow;
let pluginControllerWindow;
let pluginConfigWindow;
let registerWindow;
let loginWindow;
let paymentWindow;
let installModal;

// Create a plugin instance and open a window for it
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
    if (plugin) {
      store.set(`pluginData.${pluginKey}`, {
        ...plugin,
        isWorking: false,
      });
    }
  });
}

// Create a window to add funds to user account
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

// Create window to register user account
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

// Create window to log in into existing account
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

// Create window to display plugin settings
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

const position = store.get('windowPosition');
if (!position) {
  store.set('windowPosition', [0, 0]);
}
const windowSize = store.get('windowSize');
if (!windowSize) {
  store.set('windowSize', [800, 700]);
}
const bar = store.get('bar');
if (!bar) {
  store.set('bar', false);
}


// Create main application window
async function createMainWindow() {
  const [width, height] = store.get('windowSize');

  mainWindow = new BrowserWindow({
    minWidth: 80,
    minHeight: 300,
    width,
    height,
    x: store.get('windowPosition')[0],
    y: store.get('windowPosition')[1],
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
    transparent: true,
    titleBarStyle: 'customButtonsOnHover',
    frame: false,
    hasShadows: false,
  });


  // Remove menubar for Windows and Linux
  mainWindow.removeMenu();

  mainWindow.loadURL(path.join(baseUrl, 'public', 'index.html'));

  console.log(process.platform);

  if (/(win32|linux)/.test(process.platform)) {
    let resizeTimeout;
    let prevSize = [width, height];

    const onResize = debounce(() => {
      // mainWindow.on('resize', (evt) => {
      console.log('resize trigged');
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const size = mainWindow.getSize();
        console.log(size, prevSize);

        if (size.width - prevSize.width === 1 || size.height - prevSize.height === 1) {
          return;
        }

        prevSize = size;

        if (size && size[0] && (size[0] / size[1] === 4 / 3)) {
          mainWindow.setSize(size[0], parseInt((size[0] * 3) / 4, 10));
        }
      }, 1);
      // });
    }, 500);
    mainWindow.addListener('resize', onResize);
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

  const autolaunch = await store.get('autolaunch');
  if (!autolaunch) {
    store.set('autolaunch', false);
  }

  const isPluginsPreinstalled = await store.get('isPluginsPreinstalled');
  if (!isPluginsPreinstalled) {
    preinstallPlugins();
  }
  const onMove = debounce(() => {
    store.set('windowPosition', mainWindow.getPosition());
  }, 500);
  mainWindow.addListener('move', onMove);

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

  // Handle successful login
  ipcMain.on('logged-in', (event, user) => {
    log('logged in as', user.email);
    store.set('user', user);
    mainWindow.webContents.send('logged-in');
  });

  // Uninstall and remove data from all plugins
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

  // Uninstall plugin and remove its data from electron-store
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
    // Stop server when mainWindow is closed
    closeServer();
    mainWindow = null;
  });
}


// Create install modal window
async function createInstallModalWindow(pluginParams) {
  installModal = new BrowserWindow({
    width: 500,
    height: 300,
    minWidth: 200,
    minHeight: 200,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    },
    frame: false,
  });
  await installModal.loadURL(path.join(baseUrl, 'public', 'install-modal-window.html'));

  // delete  devtools
  if (process.env.NODE_ENV === 'development') {
    installModal.webContents.openDevTools();
  }

  installModal.webContents.send('unpacked-plugin-data', pluginParams);

  installModal.on('closed', () => {
    installModal = null;
  });
}

const getMainWindow = () => mainWindow;

module.exports = {
  createInstallModalWindow,
  getMainWindow,
  createMainWindow,
};
