export default (propName, { make, when }) => props => (props[propName] && (!when || when(props))
  ? `${make}: ${props[propName]};`
  : '');
