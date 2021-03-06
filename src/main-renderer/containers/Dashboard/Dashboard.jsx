import React, { useEffect, useState } from 'react';
import { remote } from 'electron';
import request from 'request-promise-native';
import requestDebug from 'request-debug';
import {
  useSettings, useModals, useAuth, useIpc,
} from 'hooks';
import { Flex, Text } from 'styled';
import { Spinner } from 'components';
import store from 'store';
import MacOsTitleBar from 'react-electron-titlebar';
import { TitleBar as WindowsTitlebar } from 'react-desktop/windows';
import Plugins from '../Plugins';
import Menu from '../Menu';
import Settings from '../Settings';
import Logs from '../Logs';

import DevMenu from './DevMenu';
import {
  AnimatedDockHandleBar, AnimatedDockWrapper, Title, TitleWrapper,
} from './styled';

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
  const isDarvin = process.platform === 'darwin';


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
          store.set('windowSize', [width, height]);
          currentWindow.setHasShadow(false);
          currentWindow.setMinimumSize(80, 750);
          currentWindow.setMaximumSize(80, 750);
          currentWindow.setSize(80, 700);
          store.set('resizable', false);
        }
      } else {
        store.set('resizable', true);
        const lastSize = await store.get('windowSize');
        currentWindow.setMinimumSize(750, 600);
        currentWindow.setMaximumSize(3000, 3000);
        currentWindow.setHasShadow(true);
        currentWindow.setSize(...lastSize);
      }
    };
    initializeBar();
  }, [showBar]);

  const resize = debounce(() => {
    store.set('windowSize', currentWindow.getSize());
  }, 50);

  useEffect(() => {
    currentWindow.addListener('resize', resize);
    return () => {
      currentWindow.removeListener('resize', resize);
    };
  });
  const onBarHandler = () => {
    if (currentWindow.isFullScreen()) {
      currentWindow.setFullScreen(false);
      setShowBar(!store.get('bar'));
      store.set('bar', !showBar);
    } else {
      setShowBar(!store.get('bar'));
      store.set('bar', !showBar);
    }
  };

  return (
    <Flex height="100%" width="100%" background="#fff" align={showBar ? 'center' : 'flex-start'}>
      {!showBar && isDarvin && (
        <TitleWrapper>
          <MacOsTitleBar />
          <Title>Deskfiler</Title>
        </TitleWrapper>
      )}

      {!showBar && !isDarvin && (
        <Flex row width="100%">
          <Flex app-region="drag" height="100%" width="100%" />
          <WindowsTitlebar
            style={{ marginLeft: 'auto', width: '138px' }}
            controls
            onMinimizeClick={() => currentWindow.minimize()}
            onCloseClick={() => currentWindow.close()}
            onMaximizeClick={() => {
              currentWindow.setFullScreen(!currentWindow.isFullScreen());
            }}
          />
          <Title>Deskfiler</Title>
        </Flex>
      )}

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
          {showBar && <Plugins setShowBar={setShowBar} showBar={showBar} />}
          <AnimatedDockWrapper
            onClick={onBarHandler}
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
