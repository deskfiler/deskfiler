import React, { useState } from 'react';
import { shell } from 'electron';

import brandingLogo from 'assets/images/deskfiler-logo.svg';
import closeWhiteIcon from 'assets/images/closewhite.svg';
import burgerIcon from 'assets/images/burger.svg';

import { useAuth, useUiState, useIpc } from 'hooks';

import { Flex, Text, colors } from 'styled';

import * as S from './styled';

const titles = {
  plugins: 'Plugins',
  settings: 'Settings',
  logs: 'Logs',
};

const Menu = () => {
  const [uiState, { setUiState }] = useUiState();
  const [auth, { logout }] = useAuth();
  const [open, setOpen] = useState();
  const { openRegisterWindow, openLoginWindow } = useIpc();

  return (
    <Flex z={9} position="absolute" right="0px" width="64px" align="center" padding="8px">
      <S.OpenMenu onClick={() => setOpen(true)}>
        <S.BurgerIcon src={burgerIcon} />
      </S.OpenMenu>
      <Flex.Absolute
        height="100vh"
        width="100vw"
        transf={open ? 'translateX(-186px)' : 'translateX(64px)'}
        transition="transform .3s ease"
      >
        <Flex
          width="250px"
          height="100%"
          shadow="-2px -2px 8px 2px rgba(0, 0, 0, .15)"
          background={colors.primary}
          onClick={e => e.stopPropagation()}
        >
          <Flex
            row
            align="center"
            justify="space-between"
            padding="20px 7.3%"
            marginBottom="40px"
            flex="0 0 auto"
          >
            <S.BrandingLogo src={brandingLogo} />
            <S.HideMenu
              onClick={() => setOpen(false)}
            >
              <S.CloseIcon src={closeWhiteIcon} />
            </S.HideMenu>
          </Flex>
          <Flex
            width="80%"
            paddingLeft="15px"
            margin="0 10px 80px"
            flex="1 0 auto"
          >
            {Object
              .keys(titles)
              .map(key => (
                <S.MenuItem
                  key={key}
                  onClick={() => {
                    if (key === 'plugins') {
                      shell.openExternal('https://plugins.deskfiler.org/list.php');
                    } else {
                      setUiState('sideView', key.toLowerCase());
                    }
                  }}
                >
                  <Flex
                    row
                    align="center"
                    padding="14px 0"
                  >
                    <S.Icon type={key} />
                    {titles[key]}
                  </Flex>
                  <S.Divider />
                </S.MenuItem>
              ))
            }
          </Flex>
          {auth.token === null ? (
            <Flex
              row
              width="100%"
              padding="16px"
              flex="0 0 auto"
            >
              <S.OutlineButton onClick={openRegisterWindow}>
                Register
              </S.OutlineButton>
              <S.OutlineButton onClick={openLoginWindow}>
                Login
              </S.OutlineButton>
            </Flex>
          ) : (
            <Flex column width="100%" padding="16px">
              <Text color="white">
                Signed in as {auth.profile.OZMAIL}
              </Text>
              {/* eslint-disable-next-line */}
              <a
                href="#"
                style={{ padding: '5px 0px' }}
                onClick={logout}
              >
                Sign out
              </a>
            </Flex>
          )}
        </Flex>
      </Flex.Absolute>
    </Flex>
  );
};

export default Menu;
