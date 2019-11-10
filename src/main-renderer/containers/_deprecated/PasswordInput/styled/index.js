import styled from 'styled-components';

export const Password = styled.span`
  display: flex;
`;

export const ShowPassword = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 9px;
  text-decoration: none;
  cursor: pointer;
  background: #1D4779;;
  &:hover {
    background: #004a87;
  }
`;

export const ShowPasswordIcon = styled.img`
  height: 25px;
`;

export const PasswordInput = styled.input`
  margin: 0;
  &::placeholder {
    color: ${({ hasError }) => (hasError ? 'red' : '#cacaca')};
  }
`;
