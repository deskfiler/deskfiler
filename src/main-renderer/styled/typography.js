import styled, {
  createGlobalStyle,
  css,
} from 'styled-components';

import robotoThin from 'assets/fonts/Roboto-Thin.ttf';
import robotoLight from 'assets/fonts/Roboto-Light.ttf';
import robotoRegular from 'assets/fonts/Roboto-Regular.ttf';
import robotoMedium from 'assets/fonts/Roboto-Medium.ttf';
import robotoBold from 'assets/fonts/Roboto-Bold.ttf';
import robotoBlack from 'assets/fonts/Roboto-Black.ttf';

import sourceSansFont from 'assets/fonts/SourceSansPro-Regular.ttf';
import eurostileNormalFont from 'assets/fonts/Eurostile-Normal.woff';
import eurostileRegularFont from 'assets/fonts/Eurostile-Regular.woff';

import {
  getProp,
  fromProp,
} from './utils';

const DEFAULT_TEXT_COLOR = '#222222';

export const fontsCss = `
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 100;
    src: url(${robotoThin});
  }

  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 300;
    src: url(${robotoLight});
  }

  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    src: url(${robotoRegular});
  }

  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    src: url(${robotoMedium});
  }

  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    src: url(${robotoBold});
  }

  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 900;
    src: url(${robotoBlack});
  }

  @font-face {
    font-family: 'Source Sans Pro';
    font-style: normal;
    font-weight: 400;
    src: url(${sourceSansFont});
  }

  @font-face {
    font-family: 'Eurostile';
    font-style: normal;
    font-weight: normal;
    src: url(${eurostileRegularFont});
  }


  @font-face {
    font-family: 'EuroStyle Normal';
    font-style: normal;
    font-weight: normal;
    src: url(${eurostileNormalFont});
  }
`;

export const Fonts = createGlobalStyle`
  ${fontsCss};
`;

export const Text = styled.span`
  display: ${props => (props.newline ? 'block' : 'inline')};
  ${props => (props.hideOverflow && css`
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: -webkit-fill-available;
  `)};
  color: ${getProp('color', DEFAULT_TEXT_COLOR)};
  font-size: ${getProp('size', '14px')};
  font-weight: ${getProp('weight', 400)};
  ${fromProp('line', { make: 'line-height' })};
  ${fromProp('align', { make: 'text-align' })};
`;

Text.Thin = styled(Text).attrs({ weight: 100 })``;

Text.Light = styled(Text).attrs({ weight: 300 })``;

Text.Medium = styled(Text).attrs({ weight: 500 })``;

Text.Bold = styled(Text).attrs({ weight: 700 })``;

Text.Black = styled(Text).attrs({ weight: 900 })``;
