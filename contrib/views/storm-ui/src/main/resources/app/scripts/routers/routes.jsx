import React, {Component} from 'react';
import {Router, Route, hashHistory, browserHistory, IndexRoute} from 'react-router';
import Dashboard from '../containers/Dashboard';

const onEnter = (nextState, replace, callback) => {
  callback();
};

export default(
  <Route path="/" component={null} name="Home" onEnter={onEnter}>
    <IndexRoute name="" component={Dashboard} onEnter={onEnter}/>
  </Route>
);
