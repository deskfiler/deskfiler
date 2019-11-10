import React from 'react';
import * as S from './styled';

const Label = ({ value, subvalue, htmlFor, ...rest }) => (
  <S.Label {...rest}>
    {value}
  </S.Label>
);

export default Label;
