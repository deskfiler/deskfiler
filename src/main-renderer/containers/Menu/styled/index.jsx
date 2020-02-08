import React from 'react';
import styled from 'styled-components';

import {
  Menu as FoundationMenu,
  MenuItem as FoundationMenuItem,
} from 'react-foundation';

import IconComponent from 'components/Icon';

export const Menu = styled(({
  isMenuOpen,
  ...props
}) => <FoundationMenu {...props} />)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 3;
  height: 100%;
  color: #fff;
  background: #0f294b;
  transition: transform .3s ease-out;
  box-shadow: ${({ isMenuOpen }) => (isMenuOpen ? '4px 2px 15px 12px #b9adad' : 'none')};
  transform: ${({ isMenuOpen }) => (isMenuOpen
    ? 'translate3d(0px, 0px, 0px)'
    : 'translate3d(100%, 0px, 0px)'
  )};
`;

export const BrandingLogo = styled.img`
  height: 30px;
`;

export const HideMenu = styled.div`
  cursor: pointer;
  width: 24px;
  zIndex: 20;
  app-region: no-drag;
`;

export const CloseIcon = styled.img`
  height: 20px;
`;

export const Icon = styled(IconComponent)`
  height: 30px;
  margin-right: 8px;
  opacity: 0.5;
`;

export const Divider = styled.hr`
  margin: 0;
  border-bottom: 1px solid rgba(255,255,255,0.5);
  position: relative;
  width: 100%;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    transform: scaleX(0.00);
    transform-origin: 0% 100%;
    transition: transform .3s ease-out;
    z-index: -1;
    border: 2px solid #f4c036;
    width: 100%;
  }
`;

export const MenuItem = styled(FoundationMenuItem)`
  display: flex;
  flex-direction: column;
  width: 100%;
  color: rgb(255,255,255, 0.5);
  cursor: pointer;
  font-family: Roboto;
  &:hover {
    color: #fff;
    & ${Icon} {
      opacity: 1;
    }
    & > ${Divider}::after {
      transform: scaleX(1);
      z-index: 3;
    }
  }
`;

export const OpenMenu = styled.div`
-webkit-app-region:${({ showBar }) => (showBar ? 'drag' : 'no-drag')};
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
  padding-top: ${({ showBar }) => (showBar ? '0' : '16px')};
  &:hover {
    img {
      transform: ${({ showBar }) => (showBar ? '' : 'translateX(-25%)')};
      filter:  ${({ showBar }) => (showBar ? '' : 'drop-shadow(4px 0px 0px rgba(0,0,0,.2))')};
    }
  }  
`;

export const BurgerIcon = styled.img`
  height: ${({ showBar }) => (showBar ? '30px' : '20px')};
  transform: translateX(0%);
  transition: transform .25s ease-in, filter .25s ease-out;
   -webkit-user-select: none;
`;

export const OutlineButton = styled.a`
  text-align: center;
  text-decoration: none;
  flex: 1 0 50%;
  color: rgb(255,255,255, 0.5);
  font-family: Roboto;
  &:hover {
    color: #fff;
  }
`;
