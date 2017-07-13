/**
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at
*
     http://www.apache.org/licenses/LICENSE-2.0
*
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

import React, {Component} from 'react';
import BaseContainer from './BaseContainer';
import SearchLogs from '../components/SearchLogs';
import TopologyREST from '../rest/TopologyREST';
import {Accordion, Panel} from 'react-bootstrap';
import TopologyGraph from '../components/TopologyGraph';
import {
  Table,
  Thead,
  Th,
  Tr,
  Td,
  unsafe
} from 'reactable';
import CommonPagination from '../components/CommonPagination';
import {Link} from 'react-router';
import {toastOpt,pageSize} from '../utils/Constants';
import Utils from '../utils/Utils';
import FSReactToastr from '../components/FSReactToastr';
import CommonNotification from '../components/CommonNotification';
import Breadcrumbs from '../components/Breadcrumbs';

export default class ComponentDetailView extends Component {
  constructor(props){
    super(props);
    this.state = {
      componentDetail: {},
      inputStatsActivePage: 1,
      outputStatsActivePage: 1,
      executorStatsActivePage: 1,
      componentErrorsActivePage: 1
    };
    this.fetchDetails();
  }

  fetchDetails(){
    TopologyREST.getTopologyComponentDetail(this.props.params.id, this.props.params.name, {
      window: ':all-time',
      sys: true
    }).then((res) => {
      this.setState({componentDetail: res});
    });
  }

  getLinks(){
    const {componentDetail} = this.state;
    var links = [
      {link: '#/', title: 'Dashboard'},
      {link: '#/topology', title: 'Topology Listing'},
      {link: '#/topology/'+componentDetail.topologyId, title: componentDetail.name || ""},
      {link: 'javascript:void(0);', title: componentDetail.id || ""}
    ];
    return links;
  }

  renderStatsRow(){
    const {componentDetail} = this.state;
    const spoutFlag = (componentDetail.componentType === 'spout' ? true: false);
    const statsArr = componentDetail.spoutSummary || componentDetail.boltStats;
    if(statsArr){
      return statsArr.map(function(stats, i){
        return (
          <tr key={i}>
            <td>{stats.windowPretty}</td>
            <td>{stats.emitted}</td>
            <td>{stats.transferred}</td>
            {spoutFlag ? <td>{stats.completeLatency}</td> : null}
            {!spoutFlag ? <td>{stats.executeLatency}</td> : null}
            {!spoutFlag ? <td>{stats.executed}</td> : null}
            {!spoutFlag ? <td>{stats.processLatency}</td> : null}
            <td>{stats.acked}</td>
            <td>{stats.failed}</td>
          </tr>
        );
      });
    }
  }

  handleFilter(){
    console.log('handleFilter');
  }

  callBackFunction(){
    console.log('callBackFunction');
  }

  getContent(type, noDataText){
    const activePage = this.state[type+'ActivePage'];
    const typeArr = this.state.componentDetail[type];

    const FilteredEntities = Utils.filterByKey(typeArr || [], '');

    const PaginationObj = {
      activePage: activePage,
      pageSize,
      filteredEntities : FilteredEntities
    };

    return [
      <div className="input-group col-sm-4">
        <input type="text"  onKeyUp={this.handleFilter.bind(this,'spout')} className="form-control" placeholder="Search By Key" />
        <span className="input-group-btn">
          <button className="btn btn-primary" type="button"><i className="fa fa-search"></i></button>
        </span>
      </div>,
      this['get'+type+'Table'](FilteredEntities, activePage, noDataText),
      (FilteredEntities.length !== 0
        ? <CommonPagination  {...PaginationObj} callBackFunction={this.callBackFunction.bind(this)} tableName={type}/>
        : '')
    ];
  }

  getinputStatsTable(FilteredEntities, activePage, noDataText){
    const {componentDetail} = this.state;
    const spoutFlag = (componentDetail.componentType === 'spout' ? true: false);

    return (
    <Table className="table no-margin"  noDataText={noDataText}  currentPage={activePage-1} itemsPerPage={pageSize}>
      <Thead>
        <Th column="component" title="The ID assigned to a the Component by the Topology.">Component</Th>
        <Th column="stream" title="The name of the Tuple stream given in the Topolgy, or &#34;default&#34; if none was given.">Stream</Th>
        <Th column="executeLatency" title="The average time a Tuple spends in the execute method. The execute method may complete without sending an Ack for the tuple.">Execute Latency (ms)</Th>
        <Th column="executed" title="The number of incoming Tuples processed.">Executed</Th>
        <Th column="processLatency" title="The average time it takes to Ack a Tuple after it is first received.  Bolts that join, aggregate or batch may not Ack a tuple until a number of other Tuples have been received.">Process Latency (ms)</Th>
        <Th column="acked" title="The number of Tuples acknowledged by this Bolt.">Acked</Th>
        <Th column="failed" title="The number of tuples Failed by this Bolt.">Failed</Th>
      </Thead>
      {
        _.map(FilteredEntities, (d,i) => {
          return (
            <Tr key={i}>
              <Td column="component">{d.component}</Td>
              <Td column="stream">{d.stream}</Td>
              <Td column="executeLatency">{d.executeLatency}</Td>
              <Td column="executed">{d.executed}</Td>
              <Td column="processLatency">{d.processLatency}</Td>
              <Td column="acked">{d.acked}</Td>
              <Td column="failed">{d.failed}</Td>
            </Tr>
          );
        })
      }
    </Table>
    );
  }

  getoutputStatsTable(FilteredEntities, activePage, noDataText){
    const {componentDetail} = this.state;
    const spoutFlag = (componentDetail.componentType === 'spout' ? true: false);

    return(
    <Table className="table no-margin"  noDataText={noDataText}  currentPage={activePage-1} itemsPerPage={pageSize}>
      <Thead>
        <Th column="stream" title="The name of the Tuple stream given in the Topolgy, or &#34;default&#34; if none was given.">Stream</Th>
        <Th column="emitted" title="The number of Tuples emitted.">Emitted</Th>
        <Th column="transferred" title="The number of Tuples emitted that sent to one or more bolts.">Transferred</Th>
        {spoutFlag ? <Th column="completeLatency" title="The average time a Tuple &#34;tree&#34; takes to be completely processed by the Topology. A value of 0 is expected if no acking is done.">Complete Latency (ms)</Th> : null}
        {spoutFlag ? <Th column="acked" title="The number of Tuple &#34;trees&#34; successfully processed. A value of 0 is expected if no acking is done.">Acked</Th> : null}
        {spoutFlag ? <Th column="failed" title="The number of Tuple &#34;trees&#34; that were explicitly failed or timed out before acking was completed. A value of 0 is expected if no acking is done.">Failed</Th> : null}
      </Thead>
      {
        _.map(FilteredEntities, (d,i) => {
          return (
            <Tr key={i}>
              <Td column="stream">{d.stream}</Td>
              <Td column="emitted">{d.emitted}</Td>
              <Td column="transferred">{d.transferred}</Td>
              {spoutFlag ? <Td column="completeLatency">{d.completeLatency}</Td> : null}
              {spoutFlag ? <Td column="acked">{d.acked}</Td> : null}
              {spoutFlag ? <Td column="failed">{d.failed}</Td> : null}
            </Tr>
          );
        })
      }
    </Table>
    );
  }

  getexecutorStatsTable(FilteredEntities, activePage, noDataText){
    const {componentDetail} = this.state;
    const spoutFlag = (componentDetail.componentType === 'spout' ? true: false);

    return(
    <Table className="table no-margin"  noDataText={noDataText}  currentPage={activePage-1} itemsPerPage={pageSize}>
      <Thead>
        <Th column="id" title="The unique executor ID.">Id</Th>
        <Th column="uptime" title="The length of time an Executor (thread) has been alive.">Uptime</Th>
        <Th column="port" title="The hostname reported by the remote host. (Note that this hostname is not the result of a reverse lookup at the Nimbus node.) Click on it to open the logviewer page for this Worker.">Host:Port</Th>
        <Th column="emitted" title="The number of Tuples emitted.">Emitted</Th>
        <Th column="transferred" title="The number of Tuples emitted that sent to one or more bolts.">Transferred</Th>
        {!spoutFlag ? 
        [
          <Th column="capacity" title="If this is around 1.0, the corresponding Bolt is running as fast as it can, so you may want to increase the Bolt's parallelism. This is (number executed * average execute latency) / measurement time.">Capacity (last 10m)</Th>,
          <Th column="executeLatency" title=" average time a Tuple spends in the execute method. The execute method may complete without sending an Ack for the tuple.">Execute Latency (ms)</Th>,
          <Th column="executed" title="The number of incoming Tuples processed.">Executed</Th>,
          <Th column="processLatency" title="The average time it takes to Ack a Tuple after it is first received.  Bolts that join, aggregate or batch may not Ack a tuple until a number of other Tuples have been received.">Process Latency (ms</Th>,
          <Th column="completeLatency" title="The average time a Tuple &#34;tree&#34; takes to be completely processed by the Topology. A value of 0 is expected if no acking is done.">Complete Latency (ms)</Th>
        ] : <Th column="completeLatency" title="The average time a Tuple &#34;tree&#34; takes to be completely processed by the Topology. A value of 0 is expected if no acking is done.">Complete Latency (ms)</Th>
        }
        <Th column="acked" title="The number of Tuple &#34;trees&#34; successfully processed. A value of 0 is expected if no acking is done.">Acked</Th>
        <Th column="failed" title="The number of Tuple &#34;trees&#34; that were explicitly failed or timed out before acking was completed. A value of 0 is expected if no acking is done.">Failed</Th>
        <Th column="workerLogLink">Dumps</Th>
      </Thead>
      {
        _.map(FilteredEntities, (d,i) => {
          return (
            <Tr key={i}>
              <Td column="id">{d.id}</Td>
              <Td column="uptime">{d.uptime}</Td>
              <Td column="port">
                <a href={d.workerLogLink} target="_blank"> {d.host}:{d.port} </a>
              </Td>
              <Td column="emitted">{d.emitted}</Td>
              <Td column="transferred">{d.transferred}</Td>
              {!spoutFlag ? 
              [
                <Td column="capacity">{d.capacity}</Td>,
                <Td column="executeLatency">{d.executeLatency}</Td>,
                <Td column="executed">{d.executed}</Td>,
                <Td column="processLatency">{d.processLatency}</Td>
              ] : null}
              <Td column="completeLatency">{d.completeLatency}</Td>
              <Td column="acked">{d.acked}</Td>
              <Td column="failed">{d.failed}</Td>
              <Td column="workerLogLink">
                <a href={d.workerLogLink.split('/log')[0]+'/dumps/'+this.props.params.id+'/'+d.host+':'+d.port} target="_blank"><i className="fa fa-file-text"></i></a>
              </Td>
            </Tr>
          );
        })
      }
    </Table>
    );
  }

  getcomponentErrorsTable(FilteredEntities, activePage, noDataText){
    const {componentDetail} = this.state;

    return(
    <Table className="table no-margin"  noDataText={noDataText}  currentPage={activePage-1} itemsPerPage={pageSize}>
      <Thead>
        <Th column="errorTime">Time</Th>
        <Th column="errorPort">Host:Port</Th>
        <Th column="error">Error</Th>
      </Thead>
      {
        _.map(FilteredEntities, (d,i) => {
          return (
            <Tr key={i}>
              <Td column="errorTime">{d.errorTime}</Td>
              <Td column="errorPort">{d.errorPort}</Td>
              <Td column="error">{d.error}</Td>
            </Tr>
          );
        })
      }
    </Table>
    );
  }

  render(){
    const {componentDetail, InputStatsActivePage, OutputStatsActivePage, ExecutorStatsActivePage, ErrorStatsActivePage,
      inputStatsFilter, outputStatsFilter, executorStatsFilter, errorStatsFilter} = this.state;
    const spoutFlag = (componentDetail.componentType === 'spout' ? true: false);
    return (
    <BaseContainer>
      <Breadcrumbs links={this.getLinks()} />
      <SearchLogs
        id={this.props.params.id}
      />
      {/*<div className="row">
        <div className="col-sm-12">
          <div className="box filter">
            <div className="box-body form-horizontal">
              <div className="form-group no-margin">
                <label className="col-sm-1 control-label">Window</label>
                <div className="col-sm-2">
                  <select className="form-control" onChange={this.handleWindowChange} value={this.windowSize}>
                    {this.renderWindowOptions()}
                  </select>
                </div>
                <label className="col-sm-2 control-label">System Summary</label>
                <div className="col-sm-2">
                  <input className="boot-switch systemSum" type="checkbox" />
                </div>
                <label className="col-sm-1 control-label">Debug</label>
                <div className="col-sm-1">
                  <input className="boot-switch debug" type="checkbox"/>
                </div>
                <div className="col-sm-3 text-right">
                  <div className="btn-group" role="group">
                    <button type="button" className="btn btn-primary" onClick={this.handleProfiling} title="Profiling & Debugging" data-rel="tooltip">
                      <i className="fa fa-cogs"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>*/}
      <div className="row">
        <div className="col-sm-4">
          <div className="summary-tile">
            <div className="summary-title">Component Summary</div>
            <div className="summary-body">
              <p><strong>ID: </strong>{componentDetail.id}</p>
              <p><strong>Topology: </strong>{componentDetail.name}</p>
              <p><strong>Executors: </strong>{componentDetail.executors}</p>
              <p><strong>Tasks: </strong>{componentDetail.tasks}</p>
              <p><strong>Debug: </strong><a href={componentDetail.eventLogLink} target="_blank">events</a></p>
            </div>
          </div>
        </div>
        <div className="col-sm-8">
          <div className="stats-tile">
            <div className="stats-title">{spoutFlag ? "Spout Stats" : "Bolt Stats"}</div>
            <div className="stats-body">
              <table className="table table-enlarge">
                <thead>
                  <tr>
                    <th><span data-rel="tooltip" title="The past period of time for which the statistics apply.">Window</span></th>
                    <th><span data-rel="tooltip" title="The number of Tuples emitted.">Emitted</span></th>
                    <th><span data-rel="tooltip" title="The number of Tuples emitted that sent to one or more bolts.">Transferred</span></th>
                    {spoutFlag ? <th><span data-rel="tooltip" title='The average time a Tuple "tree" takes to be completely processed by the Topology. A value of 0 is expected if no acking is done.'>Complete Latency (ms)</span></th> : null}
                    {!spoutFlag ? <th><span data-rel="tooltip" title="The average time a Tuple spends in the execute method. The execute method may complete without sending an Ack for the tuple.">Execute Latency (ms)</span></th> : null}
                    {!spoutFlag ? <th><span data-rel="tooltip" title="The number of incoming Tuples processed.">Executed</span></th> : null}
                    {!spoutFlag ? <th><span data-rel="tooltip" title="The average time it takes to Ack a Tuple after it is first received.  Bolts that join, aggregate or batch may not Ack a tuple until a number of other Tuples have been received.">Process Latency (ms)</span></th> : null}
                    <th><span data-rel="tooltip" title={spoutFlag ? 'The number of Tuple "trees" successfully processed. A value of 0 is expected if no acking is done.' : "The number of Tuples acknowledged by this Bolt."}>Acked</span></th>
                    <th><span data-rel="tooltip" title={spoutFlag ? 'The number of Tuple "trees" that were explicitly failed or timed out before acking was completed. A value of 0 is expected if no acking is done.' : "The number of tuples Failed by this Bolt."}>Failed</span></th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderStatsRow()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Accordion defaultActiveKey="1">
        {componentDetail.inputStats
          ?
          <Panel header={"Input Stats ("+ componentDetail.windowHint +")"} eventKey="1">
            {this.getContent('inputStats', 'No input stats found!')}
          </Panel>
          :
          null
        }
        {componentDetail.outputStats
          ?
          <Panel header={"Output Stats ("+ componentDetail.windowHint +")"} eventKey="2">
            {this.getContent('outputStats', 'No output stats found!')}
          </Panel>
          :
          null
        }
        {componentDetail.executorStats
          ?
          <Panel header={"Executor Stats ("+ componentDetail.windowHint +")"} eventKey="3">
            {this.getContent('executorStats', 'No executor stats found!')}
          </Panel>
          :
          null
        }
        {componentDetail.componentErrors
          ?
          <Panel header={"Error Stats ("+ componentDetail.windowHint +")"} eventKey="4">
            {this.getContent('componentErrors', 'No errors found!')}
          </Panel>
          :
          null
        }
      </Accordion>
    </BaseContainer>
    );
  }
}