import styled from 'styled-components';

import {
  Button as FoundationButton,
} from 'react-foundation';

export const SettingsView = styled.div`
  z-index: 10;
  height: 100%;
  width: 100vw;
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  transform: ${props => (props.show
    ? 'translate3d(0px, 0px, 0px)'
    : 'translate3d(-100%, 0px, 0px)'
  )};
  transition: transform .15s ease-in-out;
  font-family: Roboto;
`;

export const ConfigIcon = styled.img`
  height: 20px;
`;

export const Settings = styled.div`
  height: 100%;
  padding: 50px 40px 0;
  position: relative;
  border-right: 1px solid #eee;
  overflow-y: auto;
  z-index: 1000;
`;

export const SettingsMenuItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 0;
  min-height: 41px;
  color: black;
  background: #fff;
  border-bottom: 1px solid black;
  cursor: pointer;
  -webkit-app-region: no-drag;
`;

export const SettingsMenuTitle = styled(SettingsMenuItem)`
  background: #f4c036;
  cursor: default;
`;

export const SettingsMenuTab = styled(SettingsMenuItem)`
  background: #1D4779;
  border-bottom: 1px solid #0f294b;

  color: ${({ isSelected }) => (isSelected ? '#f4c036' : '#fff')};
  cursor: pointer;
  &:hover {
    background: #004a87;
  };
`;

export const SortIcon = styled.img`
  height: 17px;
  margin-left: 3px;
  cursor: pointer;

`;

export const CloseIcon = styled.img`
  z-index:100;
  -webkit-app-region: no-drag;
  height: 14px;
`;

export const Button = styled(FoundationButton)`
  width: 50%;
  -webkit-app-region: no-drag;
`;

export const Link = styled.a`
  display: block;
  -webkit-app-region: no-drag;
`;

