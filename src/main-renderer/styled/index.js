import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  html {
    font-family: Roboto;
    height: 100%;
  }

  ::-webkit-scrollbar-thumb { 
    background: rgba(15, 41, 75, 0.4);
    border-radius: 1px;
  }

  ::-webkit-scrollbar-track { 
    background: #f2f2f4;
  }

  ::-webkit-scrollbar { 
    width: 4px;
    height: 4px;
  }

  body {
    height: 100%;
    box-sizing: border-box;
  }

  #root {
    height: 100%;
  }

  * {
    box-sizing: border-box;
  }

  .ReactVirtualized__Table__headerColumn, .ReactVirtualized__Table__rowColumn {
    margin-right: 0px;
  }

  .ReactVirtualized__Grid {
    outline: none !important;
  }
`;


export Flex from './flex';
export Modal from './modal';
export Button from './button';
export colors from './colors';
export {
  Text,
  Fonts,
  fontsCss,
} from './typography';

export default GlobalStyles;
