import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as T from 'prop-types';
import { Spinner } from 'components';
import { Flex, Text } from 'styled';
import store from 'store';

import { usePlugin, useModals } from 'hooks';

import cogIcon from 'assets/images/cog.svg';
import trashcanIcon from 'assets/images/trashcan.svg';

import * as S from './styled';

const Plugin = ({ pluginKey, showBar, setShowBar }) => {
  const [_, { openModal }] = useModals();
  const [plugin, { run, remove, openSettings }] = usePlugin(pluginKey);
  const {
    acceptRestrictions,
    devPluginUrl,
    inDevelopment,
    icon,
    name,
    isInstalling,
    isWorking,
  } = plugin;

  const [isFileRejected, setIsFileRejected] = useState(false);

  const switchShowBar = (filePaths) => {
    setShowBar(!store.get('bar'));
    store.set('bar', !showBar);
    setTimeout(() => run(filePaths), 500);
  };

  const onDrop = (files) => {
    let acceptedFiles = files;

    if (acceptRestrictions) {
      acceptedFiles = files
        .filter(file => acceptRestrictions.mime.includes(file.type));

      if (!acceptedFiles.length) {
        setIsFileRejected(true);
        setTimeout(() => setIsFileRejected(false), 1000);
        return;
      }
    }
    if (showBar && pluginKey === 'wetransferconnect') switchShowBar({ filePaths: Array.from(acceptedFiles).map(file => file.path) });
    else run({ filePaths: Array.from(acceptedFiles).map(file => file.path) });
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    noKeyboard: true,
  });

  const iconUrl = inDevelopment
    ? `${devPluginUrl}/${icon}`
    : `${process.env.LOCAL_URL}/${pluginKey}/${icon}`;

  return (
    <Flex
      width={showBar ? '55px' : '33%'}
      height={showBar ? '55px' : '50%'}
      min-height={showBar ? '55px' : '50%'}
      marginTop={showBar && '26px'}
      padding={!showBar && '0px 12px 12px 0px'}
      radius={showBar ? '6px' : '50%'}
      border={showBar ? '1px solid #c5c5c5' : 'none'}
      app-region="no-drag"
    >
      <S.CardOverlay
        radius={showBar ? '6px' : '0px'}
        {...getRootProps()}
        isDragActive={isDragActive}
        isFileRejected={isFileRejected}
        onClick={() => {
          if (showBar && pluginKey === 'wetransferconnect') switchShowBar();
          if (showBar && pluginKey === 'gvision') switchShowBar();
          else run();
        }}
      >
        <S.InstallingOverlay active={isInstalling} showBar={showBar} />
        <S.DropFilesTitle showBar={showBar}>{ isFileRejected ? 'Wrong file format' : 'Drop files'}</S.DropFilesTitle>
        <S.AppCard>
          <input {...getInputProps()} />
          {isWorking ? (
            <Flex
              style={{
                width: '60%',
                padding: '2px',
                flex: '0 0 75%',
              }}
            >
              <Spinner
                size="60%"
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '80%',
                  marginLeft: '10%',
                }}
              />
            </Flex>
          ) : <S.AppIcon showBar={showBar} src={`${iconUrl}`} />}

          {showBar ? null : (
            <S.AppInfo>
              <Flex width="50%" height="1px" background="black" marginBottom="8px" />
              <Text size="18px">{isWorking ? 'Working...' : name}</Text>
              <S.AppOptions>
                <S.Remove
                  onClick={(e) => {
                    openModal('confirm', {
                      text: 'Are you sure you want to delete this plugin?',
                      confirmLabel: 'Delete',
                      onConfirm: remove,
                    });
                    e.stopPropagation();
                  }}
                >
                  <S.RemoveIcon src={trashcanIcon} />
                </S.Remove>
                <S.Settings
                  onClick={(e) => {
                    openSettings();
                    e.stopPropagation();
                  }}
                >
                  <S.SettingsIcon src={cogIcon} />
                </S.Settings>
              </S.AppOptions>
            </S.AppInfo>
          )}

        </S.AppCard>
      </S.CardOverlay>
    </Flex>
  );
};

export default Plugin;
