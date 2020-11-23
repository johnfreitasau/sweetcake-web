import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import GlobalStyle from './styles/global';
import AppProvider from './hooks/index';
import Routes from './routes/index';

const App: React.FC = () => {
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
