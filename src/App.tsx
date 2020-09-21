import React, { useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import GlobalStyle from './styles/global';
import AppProvider from './hooks/index';
import Routes from './routes/index';
import dark from './styles/themes/dark';
import light from './styles/themes/light';

const App: React.FC = () => {
  const [theme, setTheme] = useState(dark);

  return (
    <BrowserRouter>
      <AppProvider>
        <QueryParamProvider ReactRouterRoute={Route}>
          <Routes />
        </QueryParamProvider>
      </AppProvider>
      <GlobalStyle />
    </BrowserRouter>
  );
};
export default App;
