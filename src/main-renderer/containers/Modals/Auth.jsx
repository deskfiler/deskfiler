import React from 'react';
import { Flex, Modal, Text } from 'styled';
import { useModal, useIpc, useSettings } from 'hooks';
import { Button } from 'react-foundation';

import logoImage from 'assets/images/deskfiler-logo-dark.svg';

const AuthModal = () => {
  const [modal, { close }] = useModal('auth');
  const { openLoginWindow, openRegisterWindow } = useIpc();
  const [settings, { updateSettings }] = useSettings();

  const { skipRegistration } = settings;

  if (!modal.isOpen) return null;

  return (
    <Modal.Container>
      <Modal.Medium>
        <Flex background="#fff">
          {skipRegistration ? (
            <Flex align="center">
              <Text size="16px">This plugin requires a valid account on deskfiler.org:</Text>
              <Text size="16px">Please login or sign up:</Text>
            </Flex>
          ) : (
            <>
              <Flex
                row
                justify="space-between"
                width="100%"
              >
                <img src={logoImage} alt="deskfiler logo" />
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    updateSettings({
                      key: 'general',
                      values: { skipRegistration: true },
                    });
                    close();
                  }}
                >
                  X
                </div>
              </Flex>
              <Text size="20px" style={{ marginTop: 15 }}>Welcome to Deskfiler</Text>
              <Text size="16px" style={{ marginTop: 10 }}>Some plugins work better with a free account on deskfiler.org. All you need is an email and a password.</Text>
              <Text size="16px" style={{ marginTop: 10 }}>Simply use our AI gateways, backup and sync configurations...</Text>
            </>
          )}
          <Flex
            row
            align="space-between"
            marginTop="30px"
            width="100%"
          >
            <Button
              style={{ flex: '1 0 auto', marginBottom: 0 }}
              onClick={openLoginWindow}
            >
              {skipRegistration ? 'Login' : 'I have a login'}
            </Button>
            {!skipRegistration && (
              <Button
                style={{ flex: '1 0 auto', marginBottom: 0 }}
                color="secondary"
                onClick={() => {
                  updateSettings({
                    key: 'general',
                    values: { skipRegistration: true },
                  });
                  close();
                }}
              >
                Skip for later
              </Button>
            )}
            <Button
              style={{ flex: '1 0 auto', marginBottom: 0 }}
              color="secondary"
              onClick={openRegisterWindow}
            >
              {skipRegistration ? 'Sign up' : 'Free Sign-up'}
            </Button>
            {skipRegistration && (
              <Button
                style={{ flex: '1 0 auto', marginBottom: 0 }}
                color="secondary"
                onClick={() => {
                  close();
                }}
              >
                Cancel
              </Button>
            )}
          </Flex>
        </Flex>
      </Modal.Medium>
    </Modal.Container>
  );
};

export default AuthModal;
