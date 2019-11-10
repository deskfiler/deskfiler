import styled, { keyframes, css } from 'styled-components';

import colors from './colors';
import Flex from './flex';

const backdropBlur = keyframes`
  0% {
    backdrop-filter: blur(0px);
  }

  100% {
    backdrop-filter: blur(3px);
  }
`;

const def = css`
  border: 4px solid ${colors.primary};
`;

const warning = css`
  border: 4px solid ${colors.secondary};
`;

const danger = css`
  border: 4px solid ${colors.danger};
`;

const appearances = { default: def, warning, danger };

const Modal = styled(Flex)`
  z-index: 9;
  padding: 20px 30px;
  background: #fff;
  ${props => appearances[props.appearance || 'default']}
`;

Modal.Small = styled(Modal)`
  width: 300px;
`;

Modal.Medium = styled(Modal)`
  width: 500px;
`;

Modal.Container = styled(Flex).attrs({
  height: '100vh',
  width: '100vw',
  align: 'center',
  justify: 'center',
})`
  animation: ${backdropBlur} .3s ease-in forwards;
`;

export default Modal;
