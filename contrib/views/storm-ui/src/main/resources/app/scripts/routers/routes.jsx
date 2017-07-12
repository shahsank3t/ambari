import React, {Component} from 'react';
import {Router, Route, hashHistory, browserHistory, IndexRoute} from 'react-router';
import Dashboard from '../containers/Dashboard';
import TopologyListing from '../containers/TopologyListing';
import SupervisorSummary from '../containers/SupervisorSummary';
import NimbusSummary from '../containers/NimbusSummary';

const onEnter = (nextState, replace, callback) => {
  callback();
};

export default(
  <Route path="/" component={null} name="Home" onEnter={onEnter}>
    <IndexRoute name="" component={Dashboard} onEnter={onEnter}/>
    <Route path="!/topology" name="TopologyListing" component={TopologyListing} onEnter={onEnter}/>
    <Route path="!/supervisor" name="SupervisorSummary" component={SupervisorSummary} onEnter={onEnter}/>
    <Route path="!/nimbus" name="NimbusSummary" component={NimbusSummary} onEnter={onEnter}/>
  </Route>
);
