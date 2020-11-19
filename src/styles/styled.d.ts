import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    title: string;

    colors: {
      yellow: string;
      orange: string;
      gray: string;
      grayHard: string;
      white: string;
      shape: string;
      background: string;
      dark: string;
      error: string;
    };
  }
}
