import styled, { css } from 'styled-components';
import { getProp, fromProp } from './utils';

const spacing = css`
  > * {
    ${fromProp('spacing', { make: 'margin-right', when: props => !!props.row })};
    ${fromProp('spacing', { make: 'margin-bottom', when: props => !props.row })};
  }
`;

const Flex = styled.div`
  display: ${props => (props.inline ? 'inline-flex' : 'flex')};
  flex-direction: ${props => (props.row ? 'row' : 'column')};
  flex-wrap: ${props => (props.flexWrap ? 'wrap' : 'no-wrap')};
  background: ${getProp('background', 'transparent')};
  align-items: ${getProp('align', 'flex-start')};
  justify-content: ${getProp('justify', 'flex-start')};
  position: ${getProp('position', 'relative')};
  ${fromProp('flex', { make: 'flex' })}
  ${fromProp('width', { make: 'width' })};
  ${fromProp('maxWidth', { make: 'max-width' })};
  ${fromProp('height', { make: 'height' })};
  ${fromProp('maxHeight', { make: 'max-height' })};
  ${fromProp('marginLeft', { make: 'margin-left' })};
  ${fromProp('marginRight', { make: 'margin-right' })};
  ${fromProp('marginTop', { make: 'margin-top' })};
  ${fromProp('marginBottom', { make: 'margin-bottom' })};
  ${fromProp('borderLeft', { make: 'border-left' })};
  ${fromProp('borderRight', { make: 'border-right' })};
  ${fromProp('borderTop', { make: 'border-top' })};
  ${fromProp('borderBottom', { make: 'border-bottom' })};
  ${fromProp('border', { make: 'border' })};
  ${fromProp('shadow', { make: 'box-shadow' })};
  ${fromProp('padding', { make: 'padding' })};
  ${fromProp('paddingTop', { make: 'padding-top' })};
  ${fromProp('paddingBottom', { make: 'padding-bottom' })};
  ${fromProp('paddingLeft', { make: 'padding-left' })};
  ${fromProp('paddingRight', { make: 'padding-right' })};
  ${fromProp('radius', { make: 'border-radius' })};
  ${fromProp('transf', { make: 'transform' })};
  ${fromProp('transition', { make: 'transition' })};
  ${fromProp('overflow', { make: 'overflow' })};
  ${fromProp('overflowY', { make: 'overflow-y' })};
  ${fromProp('cursor', { make: 'cursor' })};
  ${fromProp('top', { make: 'top' })};
  ${fromProp('bottom', { make: 'bottom' })};
  ${fromProp('left', { make: 'left' })};
  ${fromProp('right', { make: 'right' })};
  ${fromProp('z', { make: 'z-index' })};
  ${fromProp('max-height', { make: 'left' })};
  ${fromProp('right', { make: 'right' })};
  ${fromProp('z', { make: 'z-index' })};
  ${props => props.spacing && spacing}
`;

Flex.Card = styled(Flex).attrs({
  background: 'white',
  shadow: '2px 2px 0px rgba(64, 121, 179, 0.05)',
})``;

Flex.Absolute = styled(Flex).attrs({ position: 'absolute' })`
  top: ${getProp('top', 0)};
  left: ${getProp('left', 0)};
`;

export default Flex;
