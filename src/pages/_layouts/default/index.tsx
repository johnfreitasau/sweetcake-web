import React, { useState, useCallback } from 'react';

import { ThemeProvider } from 'styled-components';
import { NumberParam, useQueryParam, StringParam } from 'use-query-params';
import Sidebar from '../../../components/Sidebar';
import Header from '../../../components/Header';
import { Container, MainContent } from './styles';

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

  const handleSearchSubmit = useCallback(
    ({ name }: SearchFormData) => {
      // setQueryPage(1);
      // setQueryName(name || undefined);
      console.log('handleSearchSubmit');
    },
    [setQueryName, setQueryPage],
  );

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Header
          onSubmit={handleSearchSubmit}
          disabled={false}
          createPage="/clients/register"
          title="Clientes"
          placeholder="Digite o nome do cliente"
        />
        <MainContent>
          <Sidebar toggleTheme={toggleTheme} />
          {children}
        </MainContent>
      </Container>
    </ThemeProvider>
  );
};

export default DefaultLayout;
