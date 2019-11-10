import React, {
  useState,
} from 'react';

import eyeShowIcon from 'assets/images/eye-show.svg';
import eyeHideIcon from 'assets/images/eye-hide.svg';
import tickIcon from 'assets/images/tick.svg';

import * as S from './styled';

const PasswordInput = ({
  defaultValue,
  masterPassword,
  isEnabled,
  onShowPassword,
  toggleEnable,
}) => {
  const [cellPassword, setCellPassword] = useState('');
  const [hasError, setHasError] = useState(false);
  return (
    <S.Password>
      <S.PasswordInput
        type="password"
        value={isEnabled ? cellPassword : defaultValue}
        placeholder={hasError ? 'Wrong master pin' : 'Input master pin'}
        disabled={!(isEnabled)}
        hasError={hasError}
        onChange={(e) => {
          setCellPassword(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.keyCode === 13 && isEnabled) {
            if (cellPassword === masterPassword) {
              onShowPassword();
            } else {
              setHasError(true);
            }
            setCellPassword('');
          }
        }}
        onBlur={(e) => {
          if (isEnabled) {
            if (!isEnabled || !cellPassword.length) {
              setHasError(false);
              toggleEnable();
            } else {
              if (cellPassword === masterPassword) {
                onShowPassword();
              }
              setHasError(true);
            }
          }
        }}
      />
      <S.ShowPassword
        onClick={(e) => {
          e.preventDefault();
          setCellPassword('');
          if (!isEnabled || !cellPassword.length) {
            setHasError(false);
            toggleEnable();
          } else {
            if (cellPassword === masterPassword) {
              onShowPassword();
            }
            setHasError(true);
          }
        }}
      >
        <S.ShowPasswordIcon
          src={isEnabled ? (cellPassword.length > 0 ? tickIcon : eyeHideIcon) : eyeShowIcon}
        />
      </S.ShowPassword>
    </S.Password>
  );
};

export default PasswordInput;
