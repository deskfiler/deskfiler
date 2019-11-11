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
  const [_, { closeModal, openModal }] = useModals();

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
    await store.set('authToken', null);
    dispatch({ type: 'logout' });
  };

  const getUser = async () => {
    const jar = request.jar();
    const cookie = request.cookie(`PHPSESSID=${auth.token}`);
    const url = 'https://plugins.deskfiler.org/api?appaction=showuser&appname=deskfiler';
    jar.setCookie(cookie, url);
    try {
      const response = await request({ url, jar }).auth('a', 'b', false);

      const { data, success } = JSON.parse(response);
      if (success) {
        fillProfile(data);
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      await store.set('authToken', null);
      logout();
      openModal(
        'auth',
        {
          customBody: (
            <Flex align="center">
              <Text>
                Oops... Looks like your session has expired.
              </Text>
            </Flex>
          ),
        },
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getAuthToken = async () => {
      const token = await store.get('authToken');
      console.log('useAuth authToken', token);
      if (token) {
        setAuthToken(token);
        closeModal('auth');
      } else {
        setIsLoading(false);
      }
    };

    getAuthToken();

    ipcRenderer.on('new-auth-token', async () => {
      getAuthToken();
    });
  }, []);


  useEffect(() => {
    const processToken = async () => {
      await store.set('authToken', auth.token);
      await getUser();
    };

    if (auth.token) {
      processToken();
    }
  }, [auth.token]);

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
