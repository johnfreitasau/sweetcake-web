import React, { useState, useCallback } from 'react';

import { ThemeProvider } from 'styled-components';
import { NumberParam, useQueryParam, StringParam } from 'use-query-params';
import Sidebar from '../../../components/Sidebar';
import Header from '../../../components/Header';
import { Wrapper } from './styles';

import dark from '../../../styles/themes/dark';
import light from '../../../styles/themes/light';

interface SearchFormData {
  name: string;
}

const DefaultLayout: React.FC = ({ children }) => {
  const [theme, setTheme] = useState(dark);
  const [queryPage, setQueryPage] = useQueryParam('page', NumberParam);
  const [queryName, setQueryName] = useQueryParam('name', StringParam);

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
