import React from 'react';
import {
  FastField,
} from 'formik';

import Label from '../Label';

const Radio = ({ field, form, lib, isInverted }) => {
  const { label, ...restLib } = lib;
  const { name, value } = field;
  const { setFieldValue } = form;
  return (
    <>
      <input
        {...restLib}
        checked={isInverted ? !value : value}
        onChange={() => setFieldValue(name, !value)}
      />
      {label && <Label value={label} htmlFor={name} />}
    </>
  );
};

const FastInput = ({ name, isInverted, ...rest }) => (
  <FastField name={name} render={p => <Radio {...p} lib={rest} isInverted={isInverted} />} />
);

export default FastInput;
