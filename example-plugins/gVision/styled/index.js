import styled from 'styled-components';

export const Flex = styled.div`
  display: ${props => (props.inline ? 'inline-flex' : 'flex')};
  flex-direction: ${props => (props.row ? 'row' : 'column')};
  flex-wrap: ${props => (props.flexWrap ? 'wrap' : 'no-wrap')};
  align-items: ${props => props.align || 'initial'};
  justify-content: ${props => props.justify || 'initial'};
  flex: ${props => props.flex || 'initial'};
  padding-right: ${props => (props.paddingRight ? props.paddingRight : '0')};
`;

export const Title = styled.h2`
  font-size: 32px;
  margin: 0;
  font-weight: 700;
  font-family: Roboto;
`;

export const HeaderLabel = styled.div`
  font-size: 20px;
  font-weight: 700;
  font-family: Roboto;
  color: #fff;
  background: #00CC33;
  padding: 10px 15px;
  margin: 24px 0;
`;