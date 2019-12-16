const {
  ipcMain,
} = require('electron');

const { download } = require('electron-dl');
const fs = require('fs');
const path = require('path');
const util = require('util');
const childProcess = require('child_process');

const mkdirp = require('mkdirp');
const rmrf = require('rimraf');

const tar = require('tar');

const store = require('./store');
const log = require('./log');
const isIt = require('./utils/whichEnvIsIt');

const {
  PLUGINS_DIR,
  APP_DIR,
  PREPACKED_PLUGINS,
  TEMP_DIR,
  LOGS_DIR,
} = require('./constants');

const rimraf = util.promisify(rmrf);

// Download plugin from deskfiler store via deskfiler:// protocol
const downloadPlugin = async (url, mainWindow) => {
  if (mainWindow && url.startsWith('deskfiler://plugins.deskfiler.org/up/')) {
    const downloadsTempDir = path.join(TEMP_DIR, 'downloads');
    try {
      log('downloading plugin');
  
      await mkdirp(downloadsTempDir);
  
      mainWindow.focus();
  
      const downloadUrl = `https:${url.split(':')[1]}`;
      const fileName = downloadUrl.split('/').slice(-1)[0];
  
      await download(mainWindow, downloadUrl, {
        directory: downloadsTempDir,
        onProgress: (progress) => { log(`download progress: ${progress * 100}%`); }
      });
  
      log('plugin downloaded!');
      const filePath = path.join(downloadsTempDir, fileName);
  
      await unpackPlugin(filePath, { mainWindow });
    } catch (err) {
      log('error during download', err);
      rimraf(downloadsTempDir);
    }
  }
};

// Unpack and install plugin from a tarball
const unpackPlugin = async (filePath, params) => {
  log('unpacking plugin', filePath);

  // const mainWindow = getMainWindow();
  const pluginTempDir = path.join(TEMP_DIR, 'plugin');
  try {
    await mkdirp(pluginTempDir);

    log('created temporary directory', pluginTempDir);

    log('unpacking plugin manifest...');

    await tar.x({
      file: filePath,
      cwd: pluginTempDir,
    }, ['manifest.json']);

    log('unpacked');

    const manifest = fs.readFileSync(path.join(pluginTempDir, 'manifest.json'), 'utf8');

    log('found plugin manifest', manifest);

    await rimraf(pluginTempDir);

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

    await rimraf(TEMP_DIR);

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

    const {
      mainWindow,
      skipConfirmation,
    } = params || {};

    if (!skipConfirmation) {
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
    }

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

      const settings = await store.get('settings');

      store.set('settings', {
        ...(settings || {}),
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
    log('error during installation', err);
    store.delete(`pluginData.${pluginKey}`);
    rimraf(TEMP_DIR);
    return null;
  }
};

// Install plugins on first app start
const preinstallPlugins = async () => {
  try {
    if (isIt('production')) {
      const pluginsPath = path.join(APP_DIR, '..', '..', 'dist', 'plugins');
      
      for (const plugin of PREPACKED_PLUGINS) {
        const filePath = path.join(pluginsPath, `${plugin}.tar.gz`);
        if (fs.existsSync(filePath)) {
          log('installing prepacked plugin', plugin);
          await unpackPlugin(filePath, { skipConfirmation: true });
        }
      }
      store.set('isPluginsPreinstalled', true);
    }
  } catch (err) {
    log('error during preinstalling', err);
  }
};

module.exports = {
  downloadPlugin,
  unpackPlugin,
  preinstallPlugins,
};