import React, {
  useState,
} from 'react';
import ReactDOM from 'react-dom';

import * as S from './styled';

const PasswordModal = ({
  title,
  masterPin,
  onSubmit,
  isVisible,
  hideModal,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);

  return (
    isVisible ? ReactDOM.createPortal(
      <S.Overlay>
        <S.PasswordModal>
          <S.Title>{title}</S.Title>
          <S.Input
            type="password"
            hasError={error}
            placeholder={error ? 'Wrong master pin' : 'Input master pin'}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          <S.Buttons>
            <S.SubmitButton
              onClick={(e) => {
                e.preventDefault();
                if (inputValue === masterPin) {
                  hideModal();
                  onSubmit();
                } else {
                  setError(true);
                  setInputValue('');
                }
              }}
            >
              Submit
            </S.SubmitButton>
            <S.CloseButton
              color="secondary"
              onClick={(e) => {
                e.preventDefault();
                hideModal();
              }}
            >
              Close
            </S.CloseButton>
          </S.Buttons>
        </S.PasswordModal>
      </S.Overlay>,
      document.body,
    ) : null
  );
};

export default PasswordModal;
