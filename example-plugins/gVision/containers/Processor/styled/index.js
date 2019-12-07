import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const Icon = styled.img`
  height: 15px;
`;

export const Spinner = styled.img`
  height: 125px;
  width: 125px;
  margin: 10px 10px 25px;
  animation: ${spin} .6s linear infinite;
`;

export const Image = styled.img`
  width: 125px;
  height: 125px;
  transition: 'all .5s ease';
`;

export const ImageWrapper = styled.div`
  width: 125px;
  height: 125px;
  overflow: hidden;
  position: relative;
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    & > ${Image} {
      transform: scale(1.5);
    }
  }
`;

export const InfoLink = styled.a`
  color: #0A0A0A;
  text-decoration: underline;
  &:hover {
    color: #0A0A0A;
    text-decoration: none;
  }
`;