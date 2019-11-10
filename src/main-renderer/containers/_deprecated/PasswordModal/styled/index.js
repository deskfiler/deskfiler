import styled from 'styled-components';

import {
  Button,
} from 'react-foundation';

export const Overlay = styled.div`
  position: fixed;
  overflow: auto;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255,255,255,0.5);
  z-index: 8;
`;

export const PasswordModal = styled.div`
  width: 300px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 9;
  font-family: Roboto;
  padding: 20px 30px;
  background: #fff;
`;

export const Title = styled.h1`
  font-size: 20px;
`;

export const Input = styled.input`
  &::placeholder {
    color: ${({ hasError }) => (hasError ? 'red' : '#cacaca')};
  }
`;

export const Buttons = styled.div`
  display: flex;
  margin-top: 10px;
`;

export const SubmitButton = styled(Button)`
  flex: 0 0 50%;
  margin: 0;
`;

export const CloseButton = styled(Button)`
  flex: 0 0 50%;
  margin: 0;
`;
