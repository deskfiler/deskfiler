import React from 'react';
import { render } from 'react-dom';
import GlobalStyles, { Fonts } from 'styled';
import { hot } from 'react-hot-loader/root';

import 'foundation-sites/dist/css/foundation.min.css';
import 'react-virtualized/styles.css';

import App from 'containers/App';

const root = document.getElementById('root');

const HotApp = hot(App);

render((
  <>
    <HotApp />
    <GlobalStyles />
    <Fonts />
  </>
), root);
