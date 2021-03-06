import styled from 'styled-components';
import { Flex } from 'styled';

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

export const AnimatedDockHandleBar = styled(Flex.Absolute)`
  height: calc(100% + 2px);
  width: ${({ showBar }) => (showBar ? '11px' : 'calc(100% + 2px)')};
  border: 1px solid black;
  background: #2F77B7;
  z-index: 2;
  transition: width .3s ease;
  border-radius: 4px;
  transform: translate(-1px, -1px);
  -webkit-app-region: no-drag;
`;

export const AnimatedDockWrapper = styled(Flex.Absolute).attrs({
  bottom: '15px',
  right: ({ showBar }) => (showBar ? '10px' : '0px'),
})`
  justify-content: center;
  align-items: center;
  width: 50px;
  margin-right: 7px;
  -webkit-app-region: no-drag;
  background: #fff;
  height: 50px;
  border-radius: 19px;
  border: 1px solid #c5c5c5;
  cursor: pointer;
  &:hover {
    ${AnimatedDockHandleBar} {
      width: ${({ showBar }) => (showBar ? 'calc(100% + 2px)' : '11px')};
    }
  }
`;
export const Title = styled.h1`
  font-size:15px;
  position:absolute;
  top:1px;
  left:calc(50% - 26px);
  color: '#0a0a0a'
`;
export const TitleWrapper = styled.div`
width:100%;
background: linear-gradient(to bottom, rgba(217,214,217,1) 0%, rgba(225,222,225,1) 44%, rgba(227,224,227,1) 58%, rgba(217,214,217,1) 93%, rgba(176,176,176,1) 100%);
`;
