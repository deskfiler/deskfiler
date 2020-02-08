import React, { useState, useEffect } from 'react';
import { ipcRenderer, shell, remote } from 'electron';
import {
  Flex,
  Text,
  Modal,
  Button,
} from '../../main-renderer/styled';

const currentWindow = remote.getCurrentWindow();

const InstallModalWindow = () => {
  const [state, setState] = useState(null);

  useEffect(() => {
    ipcRenderer.on('unpacked-plugin-data', (event, pluginParams) => {
      setState(pluginParams);
    });
  }, []);

  if (!state) return null;

  const {
    pluginKey,
    name,
    author,
    icon,
    note,
    legallink,
    legalhint,
  } = state;

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
            {/* We don't have 'note' param */}
            {/* <Text.Medium newline hideOverflow style={{ marginBottom: 10 }}> */}
            {/*  Note: {note} */}
            {/* </Text.Medium> */}
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
              style={{ '-webkit-app-region': 'no-drag' }}
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
            style={{ margin: 0, '-webkit-app-region': 'no-drag' }}
            onClick={(e) => {
              e.preventDefault();
              ipcRenderer.send('continue-plugin-installation', { shouldContinue: true });
              currentWindow.close();
            }}
          >
            Install
          </Button>
          <Button
            color="secondary"
            style={{ margin: 0, '-webkit-app-region': 'no-drag' }}
            onClick={(e) => {
              e.preventDefault();
              ipcRenderer.send('continue-plugin-installation', { shouldContinue: false });
              currentWindow.close();
            }}
          >
            Cancel
          </Button>
        </Flex>
      </Modal.Medium>
    </Modal.Container>
  );
};

export default InstallModalWindow;
