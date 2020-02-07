import React from 'react';
import ReactDOM from 'react-dom';
import { Flex } from 'styled';

import ConfirmationModal from './Confirmation';
import AlertModal from './Alert';
import AuthModal from './Auth';

export default () => ReactDOM.createPortal(
  <Flex.Absolute z={9}>
    <ConfirmationModal />
    <AlertModal />
    <AuthModal />
  </Flex.Absolute>,
  document.body,
);
