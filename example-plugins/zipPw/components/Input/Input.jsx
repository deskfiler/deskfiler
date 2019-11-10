import React from 'react';
import {
  Field,
} from 'formik';

const Input = ({ field, form, lib }) => {
  const { label, type, value, isRequired, ...restLib } = lib;
  const { name } = field;
  const { touched, setFieldValue, errors } = form;
  return (
    <>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        {...restLib}
        {...(type === 'file' ? {
          onChange: (e) => {
            setFieldValue('filePaths', Array.from(e.target.files).map(({ path }) => path));
          },
        } : {
          ...field,
          ...(isRequired && errors[name] && touched[name] ? { style: { ...restLib.style, marginBottom: 0 } } : {}),
        })}
      />
      {type !== 'file' && isRequired && errors[name] && touched[name] && <div style={{ color: 'red', fontSize: '14px' }}>Required</div>}
    </>
  );
};

const FastInput = ({
  name,
  validate,
  isRequired,
  ...rest
}) => (
  <Field name={name} {...(isRequired ? { validate } : {})} render={p => <Input {...p} lib={{ isRequired, ...rest }} />} />
);

export default FastInput;
