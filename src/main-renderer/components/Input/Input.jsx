import React from 'react';
import {
  FastField,
} from 'formik';

const Input = ({ field, form, lib }) => {
  const { label, isRequired, value, ...restLib } = lib;
  const { name } = field;
  const { touched, errors } = form;
  return (
    <>
      {label && <label htmlFor={name}>{label}</label>}
      <input {...restLib} {...field} style={isRequired && errors[name] && touched[name] ? { marginBottom: 0 } : {}} />
      {isRequired && errors[name] && touched[name] && <div style={{ color: 'red', fontSize: '14px' }}>Required</div>}
    </>
  );
};

const FastInput = ({
  name,
  validate,
  isRequired,
  ...rest
}) => (
  <FastField name={name} {...(isRequired ? { validate } : {})} render={p => <Input {...p} lib={{ isRequired, ...rest }} />} />
);

export default FastInput;
