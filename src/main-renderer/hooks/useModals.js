import { node } from 'prop-types';
import React, { createContext, useContext, useReducer } from 'react';

const modalsContext = createContext([{}, () => {}]);

const useModals = () => useContext(modalsContext);

const initialState = {
  confirm: {
    key: 'confirm',
    params: {},
    isOpen: false,
  },
  installPlugin: {
    key: 'installPlugin',
    params: {},
    isOpen: false,
  },
  alert: {
    key: 'alert',
    params: {},
    isOpen: false,
  },
  auth: {
    key: 'auth',
    params: {},
    isOpen: false,
  },
};

function modalsReducer(state, action) {
  switch (action.type) {
    case 'open':
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          params: action.meta.params,
          isOpen: true,
        },
      };
    case 'close':
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          isOpen: false,
        },
      };
    default:
      return state;
  }
}

export const ProvideModals = ({ children }) => {
  const [modals, dispatch] = useReducer(modalsReducer, initialState);

  const openModal = (key, params = {}) => dispatch({
    type: 'open',
    payload: { key },
    meta: { params },
  });

  const closeModal = key => dispatch({
    type: 'close',
    payload: { key },
  });

  return (
    <modalsContext.Provider value={[modals, { openModal, closeModal }]}>
      {children}
    </modalsContext.Provider>
  );
};

ProvideModals.propTypes = {
  children: node.isRequired,
};

export default useModals;
