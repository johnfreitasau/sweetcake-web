import React, { useState } from 'react';

import { ThemeProvider } from 'styled-components';
import { NumberParam, useQueryParam, StringParam } from 'use-query-params';
import Sidebar from '../../../components/Sidebar';
import { Wrapper } from './styles';

import dark from '../../../styles/themes/dark';

interface SearchFormData {
  name: string;
}

const DefaultLayout: React.FC = ({ children }) => {
  const [theme, setTheme] = useState(dark);
  const [queryPage, setQueryPage] = useQueryParam('page', NumberParam);
  const [queryName, setQueryName] = useQueryParam('name', StringParam);

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <Sidebar />
        {children}
      </Wrapper>
    </ThemeProvider>
  );
};

export default DefaultLayout;
