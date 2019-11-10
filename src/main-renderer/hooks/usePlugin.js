import React, { useCallback } from 'react';
import { Flex, Text } from 'styled';
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
