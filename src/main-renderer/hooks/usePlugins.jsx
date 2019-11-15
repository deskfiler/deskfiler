import { node } from 'prop-types';
import store from 'store';
import { ipcRenderer } from 'electron';
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from 'react';

const pluginsContext = createContext([{}, () => {}]);

const usePlugins = () => useContext(pluginsContext);

function pluginsReducer(state, action) {
  switch (action.type) {
    case 'update': {
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          ...action.payload,
        }
      }
    }
    case 'set':
      return {
        ...action.payload,
      };
    default:
      return state;
  }
}

export const ProvidePlugins = ({ children }) => {
  const [plugins, dispatch] = useReducer(pluginsReducer, {});

  const setPlugins = payload => dispatch({
    type: 'set',
    payload,
  });

  const updatePlugins = ({ key, payload }) => dispatch({
    type: 'update',
    key,
    payload,
  });

  const onStopWorking = (e, { pluginKey }) => {
    updatePlugins({
      key: pluginKey,
      payload: {
        isWorking: false,
      },
    });
  };

  useEffect(() => {
    async function init() {
      const initialPlugins = await store.get('pluginData');

      setPlugins(initialPlugins);
    }

    init();

    ipcRenderer.on('plugins-store-updated', (e, newData) => {
      setPlugins(newData);
    });

    ipcRenderer.on('plugin-finish-progress', onStopWorking);

    return () => {
      ipcRenderer.removeListener('plugin-finish-progress', onStopWorking);
    };
  }, []);

  return (
    <pluginsContext.Provider value={[plugins, setPlugins]}>
      {children}
    </pluginsContext.Provider>
  );
};

ProvidePlugins.propTypes = {
  children: node.isRequired,
};

export default usePlugins;
