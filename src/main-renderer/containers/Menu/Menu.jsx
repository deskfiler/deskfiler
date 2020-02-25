import React, { useState, useEffect } from 'react';
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

const Menu = ({ showBar, setShowBar }) => {
  const [uiState, { setUiState }] = useUiState();
  const [auth, { logout }] = useAuth();
  const [open, setOpen] = useState(false);
  const { openRegisterWindow, openLoginWindow } = useIpc();

  return (
    <div style={{
      width: '100%',
      position: 'absolute',
      height: '10%',
      WebkitAppRegion: 'drag',
    }}
    >
      <Flex z={9} position="absolute" right="0px" app-region="" height="10vh" width={showBar ? '80px' : '64px'} align="center" padding="8px">
        <S.OpenMenu

          showBar={showBar}
          onClick={() => {
            setOpen(!showBar);
          }}
        >
          <S.BurgerIcon showBar={showBar} src={burgerIcon} />
        </S.OpenMenu>

        {!showBar && (
          <Flex.Absolute
            top="0px"
            left="0px"
            height="100vh"
            width="100vw"
            transf={open ? 'translateX(-186px)' : `translateX(${showBar ? '80px' : '64px'})`}
            transition="transform .3s ease"
            app-region="no-drag"
          >
            <Flex
              width="250px"
              height="100%"
              background={colors.primary}
              onClick={e => e.stopPropagation()}
            >
              <Flex
                app-region="drag"
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
                  padding="30px"
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
                Signed in as
                    {' '}
                    {auth.profile.OZMAIL}
                  </Text>
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
        )}
      </Flex>
    </div>
  );
};

export default Menu;
