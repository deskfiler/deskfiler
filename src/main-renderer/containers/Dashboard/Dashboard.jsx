import React, { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import request from 'request-promise-native';
import requestDebug from 'request-debug';
import { createSaveDialog, createOpenDialog } from 'utils';
import { useSettings, useModals, useAuth } from 'hooks';
import { Flex } from 'styled';

import Plugins from '../Plugins';
import Menu from '../Menu';
import Settings from '../Settings';
import Logs from '../Logs';

import DevMenu from './DevMenu';

requestDebug(request);

const Dashboard = () => {
  const [auth] = useAuth();
  // eslint-disable-next-line
  const [_, { openModal }] = useModals();
  const [settings] = useSettings();

  const { isLoading } = auth;
  const { skipRegistration, defaultStoragePath } = settings.general;

  useEffect(() => {
    ipcRenderer.on('open-alert-modal', async (event, payload) => {
      openModal('alert', payload);
    });
  }, []);

  console.log(settings);

  useEffect(() => {
    console.log(isLoading, skipRegistration);
    if (!isLoading && skipRegistration === false) {
      openModal('auth');
    }
  }, [isLoading, skipRegistration]);

  useEffect(() => {
    const onOpenDialog = async (
      event,
      {
        fromId,
        options,
        properties,
      },
    ) => {
      const result = await createOpenDialog({
        options,
        properties,
      });

      ipcRenderer.sendTo(fromId, 'open-dialog-response', result);
    };

    ipcRenderer.on('open-dialog', onOpenDialog);
    return () => {
      ipcRenderer.removeListener('open-dialog', onOpenDialog);
    };
  }, []);

  useEffect(() => {
    const onSaveDialog = async (
      event,
      {
        fromId,
        options = {},
      },
    ) => {
      const savePath = await createSaveDialog({
        defaultPath: options.defaultFileName ? `${defaultStoragePath}/${options.defaultFileName}` : defaultStoragePath,
        ...options,
      });
      ipcRenderer.sendTo(fromId, 'save-response', savePath);
    };

    ipcRenderer.on('save-dialog', onSaveDialog);
    return () => {
      ipcRenderer.removeListener('save-dialog', onSaveDialog);
    };
  }, [defaultStoragePath]);

  const addDevPlugin = pluginUrl => {
    console.log(pluginUrl);
  };

  return (
    <Flex height="100%" width="100%">
      <DevMenu onAddDevPlugin={addDevPlugin} />
      {isLoading
        ? <div>Spinner</div>
        : (
          <Flex row width="100%" height="100%" overflow="hidden">
            <Plugins />
            <Menu />
            <Settings />
            <Logs />
          </Flex>
        )
      }
    </Flex>
  );
};

export default Dashboard;
