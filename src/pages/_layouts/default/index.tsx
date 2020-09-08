import React, { useState, useCallback } from 'react';

import { ThemeProvider } from 'styled-components';
import Sidebar from '../../../components/Sidebar';
import { Wrapper } from './styles';

import dark from '../../../styles/themes/dark';
import light from '../../../styles/themes/light';

const DefaultLayout: React.FC = ({ children }) => {
  const [theme, setTheme] = useState(dark);

  const toggleTheme = useCallback(() => {
    setTheme(theme.title === 'dark' ? dark : light);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <Sidebar toggleTheme={toggleTheme} />
        {children}
      </Wrapper>
    </ThemeProvider>
  );
};

export default DefaultLayout;
