import { useCallback } from 'react';
import { ipcRenderer } from 'electron';

import usePlugins from './usePlugins';
import useAuth from './useAuth';
import useModals from './useModals';
import useApi from './useApi';

const pluginsWithAuth = ['g-vision'];

export default function usePlugin(pluginKey) {
  const [plugins] = usePlugins();
  const [auth] = useAuth();
  const [_, { openModal }] = useModals();
  const { getPluginInfo, removePluginFromAccount } = useApi();

  const plugin = plugins[pluginKey];

  const isRequireAuth = pluginsWithAuth.includes(pluginKey);

  const run = useCallback(async ({ files, showOnStart } = {}) => {
    if (isRequireAuth) {
      if (!auth.token) {
        openModal('auth');
        return;
      }
      const { isRegistered, ticket } = await getPluginInfo({ token: auth.token, pluginKey });
      if (!isRegistered) return;
      ipcRenderer.send('open-plugin-controller-window', {
        pluginKey,
        files: null,
        showOnStart: true,
        ticket,
      });
      return;
    }

    ipcRenderer.send('open-plugin-controller-window', {
      pluginKey,
      files,
      showOnStart,
      ticket: null,
    });
  }, [pluginKey, auth.token]);

  const remove = useCallback(async () => {
    if (isRequireAuth && auth) {
      await removePluginFromAccount({ token: auth.token, pluginKey });
    }
    ipcRenderer.send('remove-plugin', pluginKey);
  }, [auth]);

  const openSettings = () => {
    ipcRenderer.send('open-plugin-config-window', pluginKey);
  };

  return [plugin, { run, remove, openSettings }];
}
