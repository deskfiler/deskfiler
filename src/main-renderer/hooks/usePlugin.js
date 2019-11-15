import React, { useCallback } from 'react';
import { Flex, Text } from 'styled';
import { ipcRenderer } from 'electron';

import usePlugins from './usePlugins';
import useAuth from './useAuth';
import useModals from './useModals';
import useApi from './useApi';
import useIpc from './useIpc';

const pluginsWithAuth = ['gvision'];

export default function usePlugin(pluginKey) {
  const [plugins, setPlugins] = usePlugins();
  const [auth] = useAuth();
  const [_, { openModal }] = useModals();
  const { getPluginInfo, removePluginFromAccount, addPluginToAccount } = useApi();
  const { openSettingsWindow } = useIpc();

  const plugin = plugins[pluginKey];

  const isRequireAuth = pluginsWithAuth.includes(pluginKey);

  const run = async ({ filePaths } = {}) => {
    const showOnStart = !!filePaths;
    let ticket = null;
    if (isRequireAuth) {
      if (!auth.token) {
        openModal('auth', {
          customBody: (
            <Flex align="center" spacing="8px">
              <Text.Medium size="16px">
                This plugin allows you to bulk process 100s of images via the
                Google Vision API and automatically recognize the content.
                For that, you must identify yourself.
              </Text.Medium>
              <Text size="16px">
                Please register or login to deskfiler,
                we will give you a certain amount of API calls for free.
              </Text>
            </Flex>
          ),
        });
        return;
      }
      const { isRegistered, ...pluginInfo } = await getPluginInfo({ token: auth.token, pluginKey });
      if (!isRegistered) {
        await addPluginToAccount({ pluginKey });
      }
      ({ ticket } = pluginInfo);
    }

    const { inDevelopment, devPluginUrl } = plugin;

    console.log('plugins usePlugin', plugins);
    setPlugins({
      ...plugins,
      [pluginKey]: {
        ...plugins[pluginKey],
        isWorking: true,
      }
    });

    // console.log('plugins', plugins);

    ipcRenderer.send('open-plugin-controller-window', {
      pluginKey,
      filePaths,
      showOnStart,
      ticket,
      inDevelopment,
      devPluginUrl,
    });
  };

  const remove = useCallback(async () => {
    if (isRequireAuth && auth) {
      await removePluginFromAccount({ token: auth.token, pluginKey });
    }
    ipcRenderer.send('remove-plugin', pluginKey);
  }, [auth]);

  return [plugin, { run, remove, openSettings: () => openSettingsWindow(pluginKey) }];
}
