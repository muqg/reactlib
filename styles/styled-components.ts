import * as styledComponents from 'styled-components';
import { ThemedStyledComponentsModule } from 'styled-components';
import { ThemeInterface } from './theme';

const {
  default: styled,
  css,
  createGlobalStyle,
  keyframes,
  ThemeContext,
  ThemeProvider
} = styledComponents as ThemedStyledComponentsModule<any> as ThemedStyledComponentsModule<ThemeInterface>

export { styled, css, createGlobalStyle, keyframes, ThemeContext, ThemeProvider };

