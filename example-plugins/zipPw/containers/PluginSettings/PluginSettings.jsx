import React from 'react';

import {
  Button,
} from 'react-foundation';

import {
  Formik,
} from 'formik';

import Checkbox from '../../components/Checkbox';
import Input from '../../components/Input';

import { Flex } from '../../styled';

import 'foundation-sites/dist/css/foundation.min.css';

import * as S from './styled';

const validate = (value, validation) => {
  let error = null;
  if (!value) {
    error = 'Required';
  } else if (validation) {
    error = validation.reduce((acc, { regExp, errorMessage }) => {
      if (new RegExp(regExp) && !(new RegExp(regExp).test(value))) {
        return errorMessage;
      };
      return acc;
    }, null);
  }
  return error;
};

const uiTypes = props => ({
  input: (
    <Input
      {...props}
      style={{ marginBottom: '8px', maxWidth: '350px', width: '100%' }}
    />
  ),
  checkbox: (
    <Checkbox
      {...props}
    />
  ),
});

const fileInputProps = {
  elementType: 'input',
  name: 'filePaths',
  type: 'file',
  multiple: true,
  label: 'Archive or add password to existing archive',
};

const PluginSettings = ({
  settings,
  pluginUi,
  startProcessing,
  cancel,
}) => (
  <Flex
    padding="20px 30px"
  >
    <S.Title>Zip PW</S.Title>
    <Formik
      enableReinitialize
      initialValues={{
        filePaths: null,
        ...settings,
      }}
      onSubmit={({ filePaths, ...restValues }) => {
        if (filePaths && filePaths.length) {
          startProcessing({ filePaths, ...restValues });
        }
      }}
      render={({
        handleSubmit,
        values,
      }) => (
        <form
          style={{ width: '100%' }}
          onSubmit={handleSubmit}
        >
          <Input {...fileInputProps} />
          {values.filePaths && (
            <Flex column>
              {pluginUi ? pluginUi.map(({ elementType, name, value, ...rest }) => (
                uiTypes({ name, key: name, validate, ...rest })[elementType]
              )) : <div>No form elements provided</div>
              }
            </Flex>
          )}
          <Flex
            row
            justify="space-between"
          >
            <Button
              type="submit"
              style={{ margin: '8px 0 0' }}
            >
              Start processing
            </Button>
            <Button
              color="secondary"
              style={{ margin: '8px 0 0' }}
              onClick={cancel}
            >
              Cancel
            </Button>
          </Flex>
        </form>
      )}
    />
  </Flex>
);

export default PluginSettings;
