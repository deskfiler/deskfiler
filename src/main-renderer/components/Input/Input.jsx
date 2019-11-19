import React from 'react';
import {
  FastField,
} from 'formik';

const Input = ({ field, form, lib }) => {
  const { label, isRequired, validation, value, ...restLib } = lib;
  const { name } = field;
  const { touched, errors } = form;
  return (
    <>
      {label && <label htmlFor={name}>{label}</label>}
      <input {...restLib} {...field} style={(isRequired || validation) && errors[name] && touched[name] ? { marginBottom: 0 } : {}} />
      {(isRequired || validation) && errors[name] && touched[name] && <div style={{ color: 'red', fontSize: '14px' }}>{errors[name]}</div>}
    </>
  );
};

const FastInput = ({
  name,
  validate,
  isRequired,
  validation,
  ...rest
}) => (
  <FastField name={name} {...(isRequired || validation ? { validate: (value) => validate(value, validation), } : {})} render={p => <Input {...p} lib={{ isRequired, validation, ...rest }} />} />
);

export default FastInput;
