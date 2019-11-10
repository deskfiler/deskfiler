import { ipcRenderer } from 'electron';

export default () => {
  const openRegisterWindow = () => {
    ipcRenderer.send('open-register-window');
  };

  const openLoginWindow = () => {
    ipcRenderer.send('open-login-window');
  };

  return {
    openRegisterWindow,
    openLoginWindow,
  };
};
