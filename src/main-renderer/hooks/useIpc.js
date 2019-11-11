import { ipcRenderer } from 'electron';

export default () => {
  const openRegisterWindow = () => {
    ipcRenderer.send('open-register-window');
  };

  const openLoginWindow = () => {
    ipcRenderer.send('open-login-window');
  };

  const openSettingsWindow = (pluginKey) => {
    ipcRenderer.send('open-plugin-config-window', pluginKey);
  };

  return {
    openRegisterWindow,
    openLoginWindow,
    openSettingsWindow,
  };
};
