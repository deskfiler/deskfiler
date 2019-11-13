import React, { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import request from 'request-promise-native';
import requestDebug from 'request-debug';
import { useSettings, useModals, useAuth, useIpc } from 'hooks';
import { Flex, Text } from 'styled';
import { Spinner } from 'components';

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
  const { initializeIpcSubscription, subscribeOnSaveDialog } = useIpc();

  const { isLoading } = auth;
  const { skipRegistration, defaultStoragePath } = settings.general;

  useEffect(() => {
    if (!isLoading && skipRegistration === false) {
      openModal('auth');
    }
  }, [isLoading, skipRegistration]);

  useEffect(initializeIpcSubscription, []);
  useEffect(subscribeOnSaveDialog, [defaultStoragePath]);

  return (
    <Flex height="100%" width="100%">
      <DevMenu />
      {isLoading
        ? (
          <Flex width="100%" height="100%" justify="center" align="center" spacing="8px">
            <Spinner />
            <Text.Bold>
              Loading...
            </Text.Bold>
          </Flex>
        ) : (
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
