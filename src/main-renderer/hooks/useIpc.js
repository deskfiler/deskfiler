import { ipcRenderer } from 'electron';

import { createSaveDialog, createOpenDialog, createModalWindow, modalWindows } from 'utils';

import { useSettings, useModals } from 'hooks';

export default () => {
  const [settings] = useSettings();
  const [_, { openModal }] = useModals();

  const { defaultStoragePath } = settings.general;

  const openRegisterWindow = () => {
    ipcRenderer.send('open-register-window');
  };

  const openLoginWindow = () => {
    ipcRenderer.send('open-login-window');
  };

  const openSettingsWindow = (pluginKey) => {
    ipcRenderer.send('open-plugin-config-window', pluginKey);
  };

  const initializeIpcSubscription = () => {
    createModalWindow({
      params: {
        width: 600,
        height: 260,
        show: false,
        title: 'Input Modal',
      },
      key: 'inputModal',
    });
    ipcRenderer.on('open-alert-modal', async (event, payload) => {
      openModal('alert', payload);
    });

    ipcRenderer.on('open-input-modal', (e, { fromId, options }) => {
      modalWindows.inputModal.webContents.send('input-modal-fields', { fromId, options });
    });

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
  };

  const subscribeOnSaveDialog = () => {
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
  };

  return {
    initializeIpcSubscription,
    subscribeOnSaveDialog,
    openRegisterWindow,
    openLoginWindow,
    openSettingsWindow,
  };
};
