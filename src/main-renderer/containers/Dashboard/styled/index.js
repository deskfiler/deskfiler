import styled from 'styled-components';

export const Dashboard = styled.div`
  background: #efefef;
  height: 100%;
  position: relative;
`;


export const Overlay = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  opacity: 0.3;
  z-index: 2;
  display: ${({ isMenuOpen }) => (isMenuOpen ? 'block' : 'none')};
`;

export const AuthFormTitle = styled.h2`
  font-size: 20px;
  font-family: Roboto;
`;
