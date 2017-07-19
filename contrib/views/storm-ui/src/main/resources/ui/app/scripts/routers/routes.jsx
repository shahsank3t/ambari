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
  shareUrl();
};

const shareUrl = () => {
  if(window != window.parent){
    var parentWindow = window.parent;
    var parentHash = parentWindow.location.hash.split("?")[0];
    var newurl = parentWindow.location.protocol + "//" + parentWindow.location.host + parentHash + '?viewpath='+encodeURIComponent(location.hash);
    parentWindow.history.replaceState({path:newurl},'',newurl);
  }
};

const getParameterByName = (name) => {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

function getInitialRoute(){
  if(window != window.parent){
    var viewPath = getParameterByName("viewpath");
    location.hash = viewPath ? viewPath : '';
  }
}
getInitialRoute();

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
