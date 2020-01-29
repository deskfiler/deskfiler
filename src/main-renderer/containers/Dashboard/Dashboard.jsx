import React, { useEffect, useState } from 'react';
import { remote } from 'electron';
import request from 'request-promise-native';
import requestDebug from 'request-debug';
import {
  useSettings, useModals, useAuth, useIpc,
} from 'hooks';
import { Flex, Text } from 'styled';
import { Spinner } from 'components';
import { Switch, Sizes } from 'react-foundation';
import store from 'store';

import Plugins from '../Plugins';
import Menu from '../Menu';
import Settings from '../Settings';
import Logs from '../Logs';

import DevMenu from './DevMenu';

import { AnimatedDockHandleBar, AnimatedDockWrapper } from './styled';

const currentWindow = remote.getCurrentWindow();


requestDebug(request);

const Dashboard = () => {
  const [auth] = useAuth();
  const [_, { openModal }] = useModals();
  const [settings] = useSettings();
  const { initializeIpcSubscription, subscribeOnSaveDialog } = useIpc();

  const { isLoading } = auth;
  const { skipRegistration, defaultStoragePath } = settings.general;
  const [showBar, setShowBar] = useState(false);


  useEffect(() => {
    if (!isLoading && skipRegistration === false) {
      openModal('auth');
    }
  }, [isLoading, skipRegistration]);

  useEffect(initializeIpcSubscription, []);
  useEffect(subscribeOnSaveDialog, [defaultStoragePath]);


  useEffect(() => {
    const initializeBar = async () => {
      const [width, height] = currentWindow.getSize();
      if (showBar) {
        console.log('currentWindow.setSize(80, height)')
        currentWindow.setHasShadow(false);
        currentWindow.setSize(80, height, true);
        store.set('windowSize', [width, height]);
      } else {
        const lastSize = await store.get('windowSize');
        currentWindow.setHasShadow(true);
        currentWindow.setSize(...lastSize, true);
      }
    }

    initializeBar();
  }, [showBar]);

  return (
    <Flex height="100%" width="100%" background={showBar ? 'transparent' : 'white'} align={showBar ? 'center' : 'flex-start'}>
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
          <Flex row width={showBar ? '80px' : '100%'} height="100%" justify="center" overflow="hidden">
            {!showBar && <Plugins />}
            <Menu setShowBar={setShowBar} showBar={showBar} />
            {!showBar && <Settings />}
            <Logs />
            {showBar && <Plugins showBar />}
            <AnimatedDockWrapper onClick={() => setShowBar(!showBar)} showBar={showBar}>
              <Flex column radius="4px" border="1px dashed #c5c5c5" width="30px" height="30px">
                <AnimatedDockHandleBar showBar={showBar} />
                <Flex.Absolute top="50%" borderTop="1px dashed #c5c5c5" width="100%" height="1px" />
              </Flex>
            </AnimatedDockWrapper>
          </Flex>
        )
            }
    </Flex>
  );
};

export default Dashboard;
