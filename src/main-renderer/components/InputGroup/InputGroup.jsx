import React from 'react';
import {
  Field,
} from 'formik';

const InputGroup = ({
  field,
  form,
  lib,
  onButtonClick,
}) => {
  const { label, buttonLabel, ...restLib } = lib;
  const { name, value } = field;
  const { setFieldValue } = form;
  return (
    <div className="input-group" style={{ height: '35px' }}>
      <span className="input-group-label">{label}</span>
      <input
        className="input-group-field"
        {...restLib}
        value={value}
        onChange={(e) => {
          setFieldValue(name, e.target.value);
        }}
      />
      <div className="input-group-button">
        <button
          className="button"
          type="button"
          onClick={() => {
            onButtonClick((filePaths) => {
              setFieldValue(name, filePaths);
            });
          }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

const FastInput = ({
  name,
  onButtonClick,
  ...rest
}) => (
  <Field
    name={name}
    render={p => (
      <InputGroup
        {...p}
        lib={rest}
        onButtonClick={onButtonClick}
      />
    )}
  />
);

export default FastInput;
