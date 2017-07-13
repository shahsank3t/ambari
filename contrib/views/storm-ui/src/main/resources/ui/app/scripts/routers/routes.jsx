import React, {Component} from 'react';
import {Router, Route, hashHistory, browserHistory, IndexRoute} from 'react-router';
import Dashboard from '../containers/Dashboard';
import TopologyListing from '../containers/TopologyListing';
import SupervisorSummary from '../containers/SupervisorSummary';
import NimbusSummary from '../containers/NimbusSummary';
import TopologyDetailView from '../containers/TopologyDetailView';
import ComponentDetailView from '../containers/ComponentDetailView';

const onEnter = (nextState, replace, callback) => {
  callback();
};

export default(
  <Route path="/" component={null} name="Home" onEnter={onEnter}>
    <IndexRoute name="" component={Dashboard} onEnter={onEnter}/>
    <Route path="topology" name="TopologyListing" component={null} onEnter={onEnter}>
      <IndexRoute name="TopologyListing" component={TopologyListing} onEnter={onEnter}/>
      <Route path=":id" name="TopologyDetailView" component={TopologyDetailView} onEnter={onEnter}/>
      <Route path=":id/component/:name" name="TopologyDetailView" component={ComponentDetailView} onEnter={onEnter}/>
    </Route>
    <Route path="supervisor" name="SupervisorSummary" component={SupervisorSummary} onEnter={onEnter}/>
    <Route path="nimbus" name="NimbusSummary" component={NimbusSummary} onEnter={onEnter}/>
  </Route>
);
