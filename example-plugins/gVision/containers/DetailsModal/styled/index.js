import styled, { keyframes } from 'styled-components';

import { Flex } from '../../../styled';

import CloseIconComponent from '../../../components/CloseIcon';

const backdropBlur = keyframes`
  0% {
    backdrop-filter: blur(0px);
  }

  100% {
    backdrop-filter: blur(3px);
  }
`;

export const ModalContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: auto;
  justify-content: center;
  align-items: center;
  left: 0;
  top: 0;
  background-color: rgba(10, 10, 10, 0.45);
  z-index: 8;
  animation: ${backdropBlur} .3s ease-in forwards;
  font-size: .875rem;
`;

export const Modal = styled(Flex)`
  z-index: 9;
  padding: 20px 30px;
  background: #fff;
  width: 85%;
  max-height: 85%;
  overflow: auto;
  border-radius: 3px;
`;

export const Image = styled.img`
  width: 200px;
  height: 200px;
  flex: 0 0 auto;
  object-fit: cover;
`;

export const Table = styled.table`
  border-spacing: 0;
  border-collapse: 'separate';

  tbody tr:nth-child(even) {
    background-color: #fff;
  }
`;

export const CloseIcon = styled(CloseIconComponent)`
  height: 20px;
`;

export const Close = styled.div`
  flex: 0 0 auto;
  height: 20px;
  cursor: pointer;
  &:hover {
    color: red;
    .st0 {
      fill: 'yellow'
    }
  }
`;