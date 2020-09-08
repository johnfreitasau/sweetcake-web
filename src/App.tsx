import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
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
        <Routes />
      </AppProvider>
      <GlobalStyle />
    </BrowserRouter>
  );
};
export default App;
