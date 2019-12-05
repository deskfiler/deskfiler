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
