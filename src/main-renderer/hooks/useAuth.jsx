import { ipcRenderer } from 'electron';
import { node } from 'prop-types';
import store from 'store';
import request from 'request-promise-native';
import { Flex, Text } from 'styled';
import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
} from 'react';

import useModals from './useModals';

const authContext = createContext([{}, () => {}]);

const useAuth = () => useContext(authContext);

const initialState = {
  token: null,
  profile: {},
  isLoading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'fillProfile':
      return {
        ...state,
        profile: action.payload,
      };
    case 'setAuthToken':
      console.log('setAuthToken', action.payload);
      return {
        ...state,
        token: action.payload,
      };
    case 'setIsLoading':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'logout':
      return {
        ...initialState,
        isLoading: false,
      };
    default:
      return state;
  }
}

export const ProvideAuth = ({ children }) => {
  const [auth, dispatch] = useReducer(authReducer, initialState);
  const [_, { closeModal }] = useModals();

  const fillProfile = profile => dispatch({
    type: 'fillProfile',
    payload: profile,
  });

  const setAuthToken = token => dispatch({
    type: 'setAuthToken',
    payload: token,
  });

  const setIsLoading = value => dispatch({
    type: 'setIsLoading',
    payload: value,
  });

  const logout = async () => {
    await store.set('user', null);
    dispatch({ type: 'logout' });
  };

  useEffect(() => {
    const getUser = async () => {
      const user = await store.get('user');
      if (user) {
        fillProfile(user);
        setAuthToken(user.token);
        closeModal('auth');
      }
      setIsLoading(false);
    };

    getUser();

    ipcRenderer.on('logged-in', async () => {
      getUser();
    });
  }, []);

  return (
    <authContext.Provider
      value={[
        auth,
        {
          fillProfile,
          setAuthToken,
          setIsLoading,
          logout,
        },
      ]}
    >
      {children}
    </authContext.Provider>
  );
};

ProvideAuth.propTypes = {
  children: node.isRequired,
};

export default useAuth;
