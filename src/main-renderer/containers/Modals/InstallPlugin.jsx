import React from 'react';
import { useModal } from 'hooks';
import { shell, ipcRenderer } from 'electron';
import {
  Flex,
  Text,
  Modal,
  Button,
} from 'styled';

const InstallModal = () => {
  const [modal, { close }] = useModal('installPlugin');

  if (!modal.isOpen) return null;

  const {
    params: {
      plugin: {
        name,
        pluginKey,
        author,
        legallink,
        legalhint,
        icon,
        note,
      },
    },
  } = modal;

  return (
    <Modal.Container>
      <Modal.Medium>
        <Flex
          row
          width="100%"
          justify="space-between"
        >
          <Flex
            style={{ minWidth: 0, margin: '5px 8px 10px 0' }}
            flex="1 1 auto"
          >
            <Text.Medium newline>
              You are installing: {name}
            </Text.Medium>
            <Text.Medium newline style={{ marginBottom: 10 }}>
              Created by: {author}
            </Text.Medium>
            <Text.Medium newline hideOverflow style={{ marginBottom: 10 }}>
              Note: {note}
            </Text.Medium>
          </Flex>
          <img
            style={{ flex: '0 0 auto', height: 90 }}
            src={`${process.env.LOCAL_URL}/${pluginKey}/${icon}`}
            alt={`${pluginKey} logo`}
          />
        </Flex>
        {legalhint && (
          <Text.Medium hideOverflow newline style={{ marginBottom: 10 }}>
            {legalhint}
          </Text.Medium>
        )}
        {legallink && (
          <Text.Medium>
            {'Read more about it on '}
            <a
              href={legallink}
              onClick={(e) => {
                e.preventDefault();
                shell.openExternal(legallink);
              }}
            >
              here
            </a>
          </Text.Medium>
        )}
        <Flex
          row
          justify="space-between"
          marginTop="15px"
        >
          <Button
            color="secondary"
            style={{ margin: 0 }}
            onClick={(e) => {
              e.preventDefault();
              ipcRenderer.send('cancel-plugin-installation');
              close();
            }}
          >
            Cancel
          </Button>
          <Button
            style={{ margin: 0 }}
            onClick={(e) => {
              e.preventDefault();
              ipcRenderer.send('install-plugin');
              close();
            }}
          >
            Install
          </Button>
        </Flex>
      </Modal.Medium>
    </Modal.Container>
  );
};

export default InstallModal;
