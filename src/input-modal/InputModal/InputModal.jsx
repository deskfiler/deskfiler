import React, {
  useState,
  useEffect,
} from 'react';

import {
  remote,
  ipcRenderer,
} from 'electron';

import { Formik } from 'formik';

import { Button } from 'react-foundation';

import { Flex } from 'styled';

import Input from 'components/Input';
import Checkbox from 'components/Checkbox';

import * as S from './styled';

const inputModal = remote.getCurrentWindow();

const validate = (value) => {
  let error;
  if (!value) {
    error = 'Required';
  }
  return error;
};

const uiTypes = props => ({
  input: (
    <Input
      type="text"
      {...props}
      style={{ marginBottom: '8px', width: '100%' }}
    />
  ),
  checkbox: (
    <Checkbox
      {...props}
    />
  ),
});

const getSectionsFromConfig = ui => (
  <Flex column>
    {ui ? ui.map(({ elementType, name, value, ...rest }) => (
      uiTypes({ name, key: name, validate, ...rest })[elementType]
    )) : <div>No form elements provided</div>
    }
  </Flex>
);

const getInitialValues = ui => ui.reduce((acc, { name, value }) => {
  acc[name] = value;
  return acc;
}, {});

const InputModal = () => {
  const [fromId, setFromId] = useState(null);
  const [formUi, setFormUi] = useState([]);
  const [formTitle, setFormTitle] = useState('');

  useEffect(() => {
    ipcRenderer.on('input-modal-fields', (event, { fromId: id, options: { ui, title } }) => {
      if (ui && title) {
        setFormUi(ui);
        setFormTitle(title);
        setFromId(id);
        inputModal.show();
      }
    });
  }, []);

  return (
    <Flex
      padding="20px 30px"
      height="100%"
      justify="center"
    >
      <S.Title>{formTitle}</S.Title>
      {formUi.length > 0 && (
        <Formik
          enableReinitialize
          initialValues={getInitialValues(formUi)}
          onSubmit={(values) => {
            ipcRenderer.sendTo(fromId, 'input-response', values);
            inputModal.hide();
            setFormUi([]);
            setFormTitle('');
            setFromId(null);
          }}
          render={({ handleSubmit }) => (
            <form
              style={{ width: '100%' }}
            >
              {getSectionsFromConfig(formUi)}
              <Flex
                row
                justify="space-between"
              >
                <Button
                  style={{ margin: '8px 0 0' }}
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  Save
                </Button>
                <Button
                  color="secondary"
                  style={{ margin: '8px 0 0' }}
                  onClick={(e) => {
                    e.preventDefault();
                    inputModal.hide();
                  }}
                >
                  Cancel
                </Button>
              </Flex>
            </form>
          )}
        />
      )}
    </Flex>
  );
};

export default InputModal;
