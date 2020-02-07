import React, { useEffect, useState } from 'react';
import { remote ,ipcRenderer} from 'electron';
import request from 'request-promise-native';
import requestDebug from 'request-debug';
import {
  useSettings, useModals, useAuth, useIpc,
} from 'hooks';
import { Flex, Text } from 'styled';
import { Spinner } from 'components';
import store from 'store';

///import {ipcRenderer} from 'electron';
import Plugins from '../Plugins';
import Menu from '../Menu';
import Settings from '../Settings';
import Logs from '../Logs';
import DevMenu from './DevMenu';
import { AnimatedDockHandleBar, AnimatedDockWrapper } from './styled';

const currentWindow = remote.getCurrentWindow();
const debounce = require('debounce');


requestDebug(request);

const Dashboard = () => {
  const [auth] = useAuth();
  const [_, { openModal }] = useModals();
  const [settings] = useSettings();
  const { initializeIpcSubscription, subscribeOnSaveDialog } = useIpc();

  const { isLoading } = auth;
  const { skipRegistration, defaultStoragePath } = settings.general;
  const [showBar, setShowBar] = useState(store.get('bar'));


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
        if (width !== 80) {
          currentWindow.setSize(80, 750);
          store.set('windowSize', [width, height]);
          currentWindow.setHasShadow(false);
          store.set('resizable', false);
        }
      } else {
        store.set('resizable', true);
        const lastSize = await store.get('windowSize');
        currentWindow.setHasShadow(true);
        currentWindow.setSize(...lastSize);
      }
    };
    initializeBar();
  }, [showBar]);

  const resize = debounce(() => {
    if (!store.get('resizable')) {
      console.log('set');
      currentWindow.setSize(80, 750);
      let size = currentWindow.getSize();
      if (size[0] < 700) size[0] = 700;
    } else store.set('windowSize', size);
  }, 50);
  currentWindow.addListener('resize', resize);
ipcRenderer.send('clear-local-cache');

  return (
    <Flex height="100%" width="100%" background="#fff" align={showBar ? 'center' : 'flex-start'}>
      <DevMenu />
      {isLoading ? (
        <Flex width="100%" height="100%" justify="center" align="center" spacing="8px">
          <Spinner />
          <Text.Bold>
              Loading...
          </Text.Bold>
        </Flex>
      ) : (
        <Flex row width={showBar ? '80px' : '100%'} height="100%" justify="center" overflow="hidden" background="#fff" resizable="true">
          {!showBar && <Plugins />}
          <Menu setShowBar={setShowBar} showBar={showBar} />
          {!showBar && <Settings />}
          <Logs />
          {showBar && <Plugins showBar={showBar} />}
          <AnimatedDockWrapper
            onClick={() => {
              setShowBar(!store.get('bar'));
              store.set('bar', !showBar);
            }}
            showBar={showBar}
          >
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
