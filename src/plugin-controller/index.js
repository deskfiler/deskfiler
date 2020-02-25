/*
 * DESKFILER PLUGIN CONTROLLER
 * Author: Ilya Lopukhin
 *
 * A plugin controller interface to provide system APIs together with context
 * layer of communication between plugin and main window
 *
 */
import { remote, shell, ipcRenderer } from 'electron';
import store from 'store';
import { updateSettingsStore, addStyles } from 'utils';
import { fontsCss } from 'styled';

import { LOGS_DIR, PORT, PLUGINS_DIR } from '../main-renderer/constants';

const fs = remote.require('fs');
const path = remote.require('path');

const hummus = remote.require('../node_modules/hummus/hummus.js');

const currentWindow = remote.getCurrentWindow();

const apiCall = async (url, params) => {
  try {
    const response = await fetch(url, {
      ...params,
      headers: {
        credentials: 'include',
        Authorization: `Basic ${btoa('a:b')}`,
        ...params.header,
      },
    });

    const json = await response.json();
    if (json.error) throw new Error(json.error);
    return json;
  } catch (err) {
    throw err;
  }
};

// Gets latest info about current plugin from Deskfiler API
const getPluginInfo = async ({ pluginKey, token }) => {
  const url = 'https://plugins.deskfiler.org/api/index.php';

  const formData = {
    appaction: 'pluginfo',
    appid: pluginKey.split('-').join(''),
    appname: 'deskfiler',
    token,
  };

  try {
    const body = new FormData();

    Object.keys(formData).forEach((key) => {
      body.append(key, formData[key]);
    });

    const { data, success } = await apiCall(url, { method: 'POST', body });

    return {
      isRegistered: success && data.userplugin,
      ticket: data,
    };
  } catch (err) {
    return {
      isRegistered: false,
    };
  }
};

// Function that injects plugin script into a plugin-controller markup
function injectPlugin({
  pluginKey,
  inDevelopment,
  devPluginUrl,
  allowedExtensions,
  filePaths,
  pluginAPIs,
  mainId,
  selfId,
  ticket,
}) {
  // Making sure that injected plugin has unique url, so webpack could always host the newest plugin
  const newScriptSrc = inDevelopment
    ? `${devPluginUrl}/index.js?version=${Date.now().toString()}`
    : `http://localhost:${PORT}/${pluginKey}/index.js?version=${Date.now().toString()}`;

  const oldScriptNode = document.querySelector('#plugin');

  if (oldScriptNode) {
    oldScriptNode.parentNode.removeChild(oldScriptNode);
  }

  // Creating a <script/> tag for a new plugin
  const scriptNode = document.createElement('script');

  scriptNode.setAttribute('type', 'text/javascript');
  scriptNode.setAttribute('src', newScriptSrc);
  scriptNode.setAttribute('id', 'plugin');

  /* If one of two options - handle accepted files,
    or open modal to choose files to process, is not specified - use one that is present */
  scriptNode.onload = async () => {
    if (filePaths) {
      window.PLUGIN.handleFiles({
        inputs: {
          filePaths,
        },
        ticket,
        ...pluginAPIs,
      });
    } else if (window.PLUGIN.handleOpen) {
      window.PLUGIN.handleOpen({ ...pluginAPIs, ticket });
    } else if (window.PLUGIN.handleFiles) {
      console.log('Got plugin open request, but PLUGIN.handleOpen is not defined, opening file dialog');
      ipcRenderer.sendTo(mainId, 'open-dialog', {
        fromId: selfId,
        options: {
          title: 'Select files',
          filters: allowedExtensions ? [{ name: 'Files', extensions: allowedExtensions }] : [{ name: 'All files', extensions: ['*'] }],
        },
        properties: ['openFile', 'multiSelections'],
      });

      ipcRenderer.once('open-dialog-response', async (
        ev,
        {
          canceled,
          filePaths,
        },
      ) => {
        if (canceled) {
          return;
        }
        window.PLUGIN.handleFiles({
          inputs: {
            filePaths,
          },
          ticket,
          ...pluginAPIs,
        });
      });
    }
  };

  // Adding default basic styles for plugin
  const styles = `
    ${fontsCss}

    body {
      font-family: Roboto;
    }
  `;

  addStyles({ styles, document });

  const body = document.querySelector('body');

  // Adding new plugin script to the plugin-controller
  body.appendChild(scriptNode);
}

// Once 'new-plugin-loaded' event is catched from the main thread - gets all passed credentials of a plugin
ipcRenderer.once('new-plugin-loaded', async (event, {
  pluginKey,
  inDevelopment,
  devPluginUrl,
  allowedExtensions,
  filePaths,
  ticket,
  mainId,
  selfId,
}) => {
  // Provides api token for plugins that need subscription
  const user = await store.get('user');
  const { token } = user || {};

  // Context var which provides simple methods to communicate with main app
  const context = {
    // Module to work with pdf
    pdf: hummus,
    // Provides plugin specified settings
    settings: {
      get: async () => {
        const settings = await store.get(`settings.${pluginKey}`);
        return settings;
      },
      set: async (values) => {
        if (values && typeof values === 'object' && values.constructor === Object) {
          await updateSettingsStore({
            key: pluginKey,
            values,
          });
        }
      },
    },
    // Provides api token for plugins that need subscription
    token,
    // Provides path to plugin own directory
    selfDir: path.join(PLUGINS_DIR, pluginKey),
    // Fires desktop notification with given message
    notify: (message) => {
      new Notification('Deskfiler', { // eslint-disable-line no-new
        title: `Plugin ${pluginKey}`,
        body: message,
      });
    },
    // Opens a modal asking user input
    readUserInput: options => new Promise((resolve) => {
      ipcRenderer.sendTo(mainId, 'open-input-modal', { fromId: selfId, options });

      ipcRenderer.once('input-response', (ev, values) => {
        resolve(values);
      });
    }),
    // Logs to plugin's log file
    log: ({
      action,
      meta,
    }) => {
      const logFile = path.join(LOGS_DIR, `${pluginKey}-logs.json`);

      const logs = JSON.parse(fs.readFileSync(logFile));

      const newLog = {
        timestamp: Date.now(),
        action,
        meta: meta || { type: 'string', value: 'none' },
      };

      const newLogs = [
        ...logs,
        newLog,
      ];

      fs.writeFileSync(logFile, JSON.stringify(newLogs, null, 2));
    },
    // Opens a native open modal window
    openDialog: ({ options, properties }) => new Promise((resolve, reject) => {
      ipcRenderer.sendTo(mainId, 'open-dialog', {
        fromId: selfId,
        options,
        properties,
      });

      ipcRenderer.once('open-dialog-response', async (
        ev,
        {
          canceled,
          filePaths,
        },
      ) => {
        if (canceled) {
          reject(new Error('Dialog cancelled'));
        }
        resolve(filePaths[0]);
      });
    }),
    // Opens a window for a subscription payment
    openPaymentWindow: userId => new Promise((resolve) => {
      ipcRenderer.send('open-payment-window', { fromId: selfId, userId });
      ipcRenderer.once('payment-recieved', async () => {
        const { ticket } = await getPluginInfo({ pluginKey, token });
        resolve(ticket);
      });
    }),
    // Opens a native save modal window
    readFilePath: options => new Promise((resolve, reject) => {
      ipcRenderer.sendTo(mainId, 'save-dialog', {
        fromId: selfId,
        options: options || {},
      });

      ipcRenderer.once('save-response', (
        ev,
        {
          canceled,
          filePath,
        },
      ) => {
        if (!canceled) {
          const { dir } = path.parse(filePath);
          if (options && options.file) {
            fs.writeFile(filePath, options.file, (err) => {
              if (err) {
                reject(new Error('File save error'));
              }
            });
          }
          resolve({
            dirPath: dir,
            filePath,
          });
        } else {
          reject();
        }
      });
    }),
    // Opens a folder in a default file manager
    openOutputFolder: filePath => new Promise((resolve, reject) => {
      shell.showItemInFolder(filePath);
      resolve();
    }),
    // Shows a window with executing plugin
    showPluginWindow: () => new Promise((resolve) => {
      currentWindow.show();
      setTimeout(() => resolve(), 1000);
    }),
    // Hides a window with executing plugin
    hidePluginWindow: () => {
      currentWindow.hide();
    },
    // Closes executing plugin window and terminates all code inside it
    exit: () => {
      currentWindow.close();
    },
    // Outputs user specified plugin data in a form of a alert modal window
    alert: (data) => {
      if (typeof data === 'string' || Array.isArray(data)) {
        ipcRenderer.sendTo(mainId, 'open-alert-modal', { fromId: selfId, pluginKey, data });
        return;
      }
      throw new Error('Invalid argument type for "alert" method. Can only be a string or an array');
    },
    // Focuses on the window with executing plugin
    focus: () => {
      currentWindow.focus();
    },
    // Start progress
    startProgress: () => {
      ipcRenderer.sendTo(mainId, 'plugin-start-progress', { fromId: selfId, pluginKey });
    },
    finishProgress: () => {
      ipcRenderer.sendTo(mainId, 'plugin-finish-progress', { fromId: selfId, pluginKey });
    },
  };

  // Final object with plugin APIs
  const pluginAPIs = {
    system: {
      fs,
      path,
      shell,
    },
    context,
  };

  injectPlugin({
    allowedExtensions,
    pluginKey,
    inDevelopment,
    devPluginUrl,
    filePaths,
    ticket,
    pluginAPIs,
    mainId,
    selfId,
  });
});
