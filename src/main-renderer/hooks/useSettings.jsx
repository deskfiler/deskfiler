import { node } from 'prop-types';
import React, {
  createContext,
  useReducer,
  useEffect,
  useContext,
} from 'react';
import { ipcRenderer } from 'electron';

import store from 'store';

const settingsContext = createContext([{}, () => {}]);

const useSettings = () => useContext(settingsContext);

const initialState = {
  general: {},
};

function settingsReducer(state, action) {
  switch (action.type) {
    case 'set':
      return {
        ...action.payload,
      };
    default:
      return state;
  }
}

export const ProvideSettings = ({ children }) => {
  const [settings, dispatch] = useReducer(settingsReducer, initialState);

  const setSettings = payload => dispatch({
    type: 'set',
    payload,
  });

  const updateSettings = ({ values, key }) => {
    setSettings({
      ...settings,
      [key]: {
        ...settings[key],
        ...values,
      },
    });
  };

  const onSettingsUpdate = (e, { pluginKey, values }) => {
    updateSettings({ key: pluginKey, values });
  };

  useEffect(() => {
    const getGeneralSettings = async () => {
      const settingsData = await store.get('settings');
      if (settingsData) {
        setSettings(settingsData);
      }
    };

    getGeneralSettings();

    ipcRenderer.on('update-plugin-settings', onSettingsUpdate);
    return () => {
      ipcRenderer.removeListener('update-plugin-settings', onSettingsUpdate); 
    };
  }, []);

  useEffect(() => {
    store.set('settings', settings);
  }, [settings]);

  return (
    <settingsContext.Provider value={[settings, { updateSettings, setSettings }]}>
      {children}
    </settingsContext.Provider>
  );
};

ProvideSettings.propTypes = {
  children: node.isRequired,
};

export default useSettings;
