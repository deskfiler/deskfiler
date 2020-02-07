import React from 'react';
import { FastField } from 'formik';
import store from 'store';
import { Flex } from 'styled';

const Checkbox = ({ form, field, lib }) => {
  const {
    label, name, value, ...restField
  } = lib;

  return (
    <Flex
      inline
      paddingRight="8px"
      app-region="no-drag"
    >
      <label>
        <input
          name={name}
          type="checkbox"
          defaultChecked={store.get('autolaunch')}
          {...restField}
          label={label}
          onChange={() => {
            const AutoLaunch = require('auto-launch');
            const appAutoLauncher = new AutoLaunch({
              name: 'Deskfiler',
            });
            appAutoLauncher.isEnabled()
              .then((isEnabled) => {
                if (isEnabled) {
                  appAutoLauncher.disable();
                  store.set('autolaunch', false);
                  return;
                }
                appAutoLauncher.enable();
                store.set('autolaunch', true);
              });
          }}
        />
        <span>{label}</span>
      </label>
    </Flex>
  );
};

const FastCheckbox = ({ name, ...rest }) => (
  <FastField
    name={name}
    render={p => <Checkbox {...p} lib={rest} />}

  />
);

export default FastCheckbox;
