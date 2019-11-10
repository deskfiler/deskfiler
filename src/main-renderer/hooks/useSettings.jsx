import { node } from 'prop-types';
import React, {
  createContext,
  useReducer,
  useEffect,
  useContext,
} from 'react';

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

  useEffect(() => {
    const getGeneralSettings = async () => {
      const settingsData = await store.get('settings');
      console.log('settings in store');
      if (settingsData) {
        setSettings(settingsData);
      }
    };

    getGeneralSettings();
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
