import React from 'react';
import { FastField } from 'formik';

import { Flex } from '../../styled';

const Checkbox = ({ form, field, lib }) => {
  const { label } = lib;
  const { name, value, ...restField } = field;
  return (
    <Flex
      inline
      paddingRight="8px"
    >
      <label>
        <input name={name} checked={value} {...restField} label={label} type="checkbox" />
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
