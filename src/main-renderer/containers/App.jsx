import React from 'react';

import AppErrorBoundary from './ErrorBoundary';
import Dashboard from './Dashboard';
import Modals from './Modals';

import {
  ProvideSettings,
  ProvidePlugins,
  ProvideModals,
  ProvideAuth,
  ProvideUiState,
} from '../hooks';

const Provider = ({ children }) => (
  <ProvideSettings>
    <ProvidePlugins>
      <ProvideModals>
        <ProvideUiState>
          <ProvideAuth>
            {children}
          </ProvideAuth>
        </ProvideUiState>
      </ProvideModals>
    </ProvidePlugins>
  </ProvideSettings>
);

const App = () => (
  <AppErrorBoundary>
    <Provider>
      <Dashboard />
      <Modals />
    </Provider>
  </AppErrorBoundary>
);

export default App;
