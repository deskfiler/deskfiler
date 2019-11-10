import React from 'react';

import { useModal } from 'hooks';
import {
  Flex,
  Text,
  Modal,
  Button,
} from 'styled';

const Confirmation = () => {
  const [modal, { close }] = useModal('confirm');

  if (!modal.isOpen) return null;

  const {
    params: {
      onConfirm,
      text,
      confirmLabel,
      cancelLabel,
    },
  } = modal;

  return (
    <Modal.Container>
      <Modal.Small appearance="danger">
        <Text.Medium>
          {text}
        </Text.Medium>
        <Flex
          row
          spacing="16px"
          marginTop="10px"
          width="80%"
        >
          <Flex>
            <Button
              onClick={() => {
                onConfirm();
                close();
              }}
            >
              {confirmLabel}
            </Button>
          </Flex>
          <Flex>
            <Button
              appearance="default"
              onClick={close}
            >
              {cancelLabel || 'Cancel'}
            </Button>
          </Flex>
        </Flex>
      </Modal.Small>
    </Modal.Container>
  );
};

export default Confirmation;
