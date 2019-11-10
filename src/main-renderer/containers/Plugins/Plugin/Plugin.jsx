import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as T from 'prop-types';
import { Flex, Text } from 'styled';

import { usePlugin, useModals } from 'hooks';

import cogIcon from 'assets/images/cog.svg';
import trashcanIcon from 'assets/images/trashcan.svg';

import * as S from './styled';

const Plugin = ({ pluginKey }) => {
  // eslint-disable-next-line
  const [_, { openModal }] = useModals();
  const [plugin, { run, remove, openSettings }] = usePlugin(pluginKey);

  const {
    acceptRestrictions,
    icon,
    name,
    isInstalling,
  } = plugin;

  const [isFileRejected, setIsFileRejected] = useState(false);

  const onDrop = useCallback((files) => {
    if (acceptRestrictions) {
      const isAllowedFileFormats = files
        .every(file => acceptRestrictions.mime.find(type => type === file.type));
      if (!isAllowedFileFormats) {
        setIsFileRejected(true);
        setTimeout(() => setIsFileRejected(false), 1000);
        return;
      }
    }

    run({ files });
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    noKeyboard: true,
  });

  return (
    <Flex width="33%" padding="0px 12px 12px 0px">
      <S.CardOverlay
        {...getRootProps()}
        isDragActive={isDragActive}
        isFileRejected={isFileRejected}
        onClick={() => {
          run();
        }}
      >
        <S.InstallingOverlay active={isInstalling} />
        <S.DropFilesTitle>{isFileRejected ? 'Wrong file format' : 'Drop files'}</S.DropFilesTitle>
        <S.AppCard>
          <input {...getInputProps()} />
          <S.AppIcon src={`${process.env.LOCAL_URL}/${pluginKey}/${icon}`} />
          <S.AppInfo>
            <Flex width="50%" height="1px" background="black" marginBottom="8px" />
            <Text size="18px">{name}</Text>
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
        </S.AppCard>
      </S.CardOverlay>
    </Flex>
  );
};

Plugin.propTypes = {
  pluginKey: T.string.isRequired,
};

export default Plugin;
