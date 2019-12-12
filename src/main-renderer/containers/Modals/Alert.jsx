import React, { useState } from 'react';
import { useModal } from 'hooks';
import {
  Modal,
  Text,
  Flex,
  Button,
} from 'styled';

import {
  checkUrl,
  copyToClipboard,
} from 'utils';

const AlertModal = () => {
  const [modal, { close }] = useModal('alert');
  const [isCopied, setCopied] = useState(false);


  if (!modal.isOpen) return null;

  const {
    params: {
      pluginKey,
      title = 'Alert',
      data,
    },
  } = modal;

  return (
    <Modal.Container>
      <Modal.Small>
        <Text.Medium size="16px">{pluginKey ? `Output from ${pluginKey} plugin:` : title}</Text.Medium>
          {data && (
            <Flex width="100%" maxHeight="200px" overflowY="auto" margin="8px 0px">
              {Array.isArray(data) ? (
                data.map(it => (
                  <Flex width="100%" margin="8px 0">
                    {Object.keys(it).map(key => {
                      const isUrl = checkUrl(it[key]);

                      return (
                        isUrl ? (
                          <Flex key={key} row align="center" justify="space-between" width="100%"  marginTop="10px">
                            <Text.Medium size="16px">{`${key.charAt(0).toUpperCase()}${key.slice(1)}: ${it[key]}`}</Text.Medium>
                            <Button
                              color={isCopied ? 'success' : 'warning'}
                              style={{ margin: 0, outline: 'none' }}
                              onClick={(e) => {
                                e.preventDefault();
                                copyToClipboard(it[key]);
                                setCopied(true);
                                setTimeout(() => {
                                  setCopied(false);
                                }, 5000);
                              }}
                            >
                              {isCopied ? 'Copied' : 'Copy'}
                            </Button>
                          </Flex>
                        ) : <Text.Medium key={key} size="16px">{`${key.charAt(0).toUpperCase()}${key.slice(1)}: ${it[key]}`}</Text.Medium>
                      );
                    })}
                  </Flex>
                ))
            ) : (
              <Text.Medium>{data}</Text.Medium>
            )}
          </Flex>
        )}
        <Button
          style={{ margin: '10px 0 0' }}
          onClick={(e) => {
            e.preventDefault();
            close();
          }}
        >
          Close
        </Button>
      </Modal.Small>
    </Modal.Container>
  );
};

export default AlertModal;
