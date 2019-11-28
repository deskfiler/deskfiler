import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Flex, colors, Text } from 'styled';
import { ipcRenderer } from 'electron';
import { useModals } from 'hooks';
import { createOpenDialog } from 'utils';

import addNewIcon from 'assets/images/app_newone.svg';

import * as S from './styled';

const ALLOWED_FILETYPES = ['application/x-tar', 'application/x-gzip'];

const AddPluginCard = () => {
  const [modals, { openModal }] = useModals();

  const openInstallModal = async (e, plugin) => {
    openModal('installPlugin', { plugin });
  };

  const addPlugin = (files) => {
    ipcRenderer.send('recieved-plugin-tarball', files);
  };

  useEffect(() => {
    ipcRenderer.on('unpacked-plugin', openInstallModal);

    return () => {
      ipcRenderer.removeListener('unpacked-plugin', openInstallModal);     
    };
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const files = [...acceptedFiles].map(
      ({
        name: pluginName,
        path,
        type,
      }) => ({
        name: pluginName,
        path,
        type,
      }),
    );

    if (files.length < 2 && ALLOWED_FILETYPES.includes(files[0].type)) {
      addPlugin(files[0].path);
    }
  }, [addPlugin]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    noKeyboard: true,
  });

  return (
    <Flex width="33%" height="50%" padding="0px 12px 12px 0px">
      <S.CardOverlay
        {...getRootProps()}
        isDragActive={isDragActive}
        onClick={async () => {
          const { cancelled, filePaths } = await createOpenDialog({
            title: 'Add plugin',
            options: {
              filters: [
                { name: '*.tar', extensions: ['tar', 'gz',] }
              ],
            },
            properties: ['openFile'],
          });
          if (!cancelled) {
            addPlugin(filePaths[0]);
          }
        }}
      >
        <S.DropFilesTitle>Drop files</S.DropFilesTitle>
        <S.AddPluginCard>
          <input {...getInputProps()} />
          <S.AppIcon src={addNewIcon} />
          <S.AppInfo>
            <Flex width="50%" height="1px" background={colors.primaryHover} marginBottom="8px" />
            <Text size="18px" color={colors.primaryHover}>Add new plugin</Text>
          </S.AppInfo>
        </S.AddPluginCard>
      </S.CardOverlay>
    </Flex>
  );
};

export default AddPluginCard;
