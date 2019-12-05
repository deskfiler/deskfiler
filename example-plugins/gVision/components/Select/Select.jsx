import React from 'react';
import {
  FastField,
} from 'formik';

import Label from '../Label';

const Select = ({ form, field, lib }) => {
  const { options, label, style } = lib;
  return (
    <div style={style}>
      <div style={{ marginBottom: 5 }}>
        <Label value={label} />
      </div>
      <select {...field}>
        {options.map(({ value, label }, idx) => (
          <option
            key={idx}
            value={value}
            selected={value === field.value}
          >
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

const FastSelect = ({
  name,
  options,
  ...rest
}) => (
  <FastField
    name={name}
    render={p => <Select {...p} lib={{ ...rest, options }} />}
  />
);

export default FastSelect;
