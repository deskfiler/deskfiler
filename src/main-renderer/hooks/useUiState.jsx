import { node } from 'prop-types';
import React, {
  createContext,
  useReducer,
  useContext,
} from 'react';

const uiStateContext = createContext([{}, () => {}]);

const useUiState = () => useContext(uiStateContext);

const initialState = {
  sideView: null,
};

function uiStateReducer(state, action) {
  switch (action.type) {
    case 'set':
      console.log('setUiState', action);
      return {
        ...action.payload,
        [action.meta.key]: action.payload,
      };
    default:
      return state;
  }
}

export const ProvideUiState = ({ children }) => {
  const [uiState, dispatch] = useReducer(uiStateReducer, {});

  const setUiState = (key, payload) => dispatch({
    type: 'set',
    payload,
    meta: {
      key,
    },
  });

  return (
    <uiStateContext.Provider value={[uiState, { setUiState }]}>
      {children}
    </uiStateContext.Provider>
  );
};

ProvideUiState.propTypes = {
  children: node.isRequired,
};

export default useUiState;
