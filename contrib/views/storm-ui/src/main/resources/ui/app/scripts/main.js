import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import debug from 'debug';
import 'babel-polyfill';
import App from './app';
import {AppContainer} from 'react-hot-loader';

import '../styles/css/toastr.min.css';
import '../styles/css/font-awesome.min.css';
import '../styles/css/bootstrap.css';
import 'animate.css/animate.css';
import 'react-select/dist/react-select.css';
import '../styles/css/style.css';

render(
  <AppContainer>
    <App/>
  </AppContainer>, document.getElementById('app_container'));

if (module.hot) {
  module.hot.accept('./app', () => {
    const NextApp = require('./app').default;
    render(
      <AppContainer>
        <NextApp/>
      </AppContainer>, document.getElementById('app_container'));
  });
}
