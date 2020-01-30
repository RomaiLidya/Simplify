import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';
import theme from './theme';
import { setUpAxiosInterceptors } from './utils/AxiosUtils';

export const remountApp = () => {
  ReactDOM.unmountComponentAtNode(document.getElementById('root')!);
  render();
};

const render = () => {
  ReactDOM.render(
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Router>,
    document.getElementById('root')
  );
};

// Actual rendering
render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// This is to set up axios interceptors for handling 401 errors
setUpAxiosInterceptors();

// For hot-reloading
if (module.hot) {
  module.hot.accept('./App', () => {
    render();
  });
}
