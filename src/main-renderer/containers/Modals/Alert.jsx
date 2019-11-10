import React from 'react';
import { useModal } from 'hooks';
import {
  Modal,
  Text,
  Flex,
  Button,
} from 'styled';

const AlertModal = () => {
  const [modal, { close }] = useModal('alert');

  if (!modal.isOpen) return null;

  const {
    params: {
      pluginKey,
      data,
    },
  } = modal;

  return (
    <Modal.Container>
      <Modal.Small>
        <Text.Medium size="16px">Output from {pluginKey} plugin:</Text.Medium>
        <Flex maxHeight="200px" overflowY="auto" margin="8px 0px">
          {data.map(it => (
            <Flex margin="8px 0">
              {Object.keys(it).map(key => (
                <span>{`${key.charAt(0).toUpperCase()}${key.slice(1)}: ${data[key]}`}</span>
              ))}
            </Flex>
          ))}
        </Flex>
        <Button
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
