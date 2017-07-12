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

export default class TopologyDetailView extends Component {
  constructor(props){
    super(props);
    this.state = {
      details: {},
      spotActivePage : 1,
      boltsActivePage : 1,
      topologyActivePage : 1,
      spotFilterValue : '',
      blotFilterValue : '',
      topologyFilterValue : ''
    };
    this.fetchDetails();
  }
  fetchDetails(){
    let promiseArr=[
      TopologyREST.getTopologyDetails(this.props.params.id),
      TopologyREST.getTopologyGraphData(this.props.params.id)
    ];

    Promise.all(promiseArr).then((results) => {
      _.map(results, (result) => {
        if(result.responseMessage !== undefined){
          FSReactToastr.error(
            <CommonNotification flag="error" content={result.responseMessage}/>, '', toastOpt);
        }
      });

      let stateObj = {};
      stateObj.details = results[0];
      stateObj.graphData = results[1];
      this.setState(stateObj);
    });
  }
  renderWindowOptions(){
    /*if(this.state.model.has('topologyStats')){
      return this.state.model.get('topologyStats').map(function(object, i){
        return ( <option key={i} value={object.window}>{object.windowPretty}</option> );
      });
    } else {
      return null;
    }*/
  }

  getWorkerData = () => {
    const {details} = this.state;
    let data='';
    _.map(details.workers,(worker,i) => {
      data += worker.host+':'+worker.port;
      if(i !== details.workers.length - 1){
        data += ', \n';
      }
    });
    return data;
  }

  getDateFormat = (d) => {
    let obj = new Date(d * 1000);
    return <span>{obj.toLocaleDateString() + ' ' + obj.toLocaleTimeString()}</span>;
  }

  handleFilter = (section,e) => {
    switch(section){
    case 'spout' : this.setState({spotFilterValue :  e.target.value.trim()});
      break;
    case 'bolt' : this.setState({blotFilterValue :  e.target.value.trim()});
      break;
    case 'topologyConfig' : this.setState({topologyFilterValue :  e.target.value.trim()});
      break;
    default :
      break;
    };
  }

  callBackFunction = (eventKey,tableName) => {
    switch(tableName){
    case 'spout' : this.setState({spotActivePage : eventKey});
      break;
    case 'bolt' : this.setState({boltsActivePage : eventKey});
      break;
    case 'topologyConfig' : this.setState({topologyActivePage : eventKey});
      break;
    default :
      break;
    };
  }

  render() {
    const {details,spotActivePage,boltsActivePage,topologyActivePage,spotFilterValue,blotFilterValue,topologyFilterValue,graphData} = this.state;
    const spoutfilteredEntities = Utils.filterByKey(details.spouts || [], spotFilterValue,'spoutId');
    const blotfilteredEntities = Utils.filterByKey(details.bolts || [], blotFilterValue,'boltId');
    const topologyfilteredEntities = Utils.filterByKey(_.keys(details.configuration) || [], topologyFilterValue);
    const spotPaginationObj = {
      activePage :spotActivePage,
      pageSize,
      filteredEntities : spoutfilteredEntities
    };
    const boltPaginationObj = {
      activePage :boltsActivePage,
      pageSize,
      filteredEntities : blotfilteredEntities
    };
    const topologyPaginationObj = {
      activePage :topologyActivePage,
      pageSize,
      filteredEntities : topologyfilteredEntities
    };
    const graphDataObj = _.isEmpty(graphData) && graphData === undefined ? {} : graphData;
    return (
    <BaseContainer>
      <SearchLogs
        id={this.props.params.id}
      />
      <div className="row">
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
                    <button type="button" className="btn btn-primary" onClick={this.handleTopologyActivation} title="Activate" data-rel="tooltip" disabled={status === 'ACTIVE' ? "disabled" : null}>
                      <i className="fa fa-play"></i>
                    </button>
                    <button type="button" className="btn btn-primary" onClick={this.handleTopologyDeactivation} title="Deactivate" data-rel="tooltip" disabled={status === 'INACTIVE' ? "disabled" : null}>
                      <i className="fa fa-stop"></i>
                    </button>
                    <button type="button" className="btn btn-primary" onClick={this.handleTopologyRebalancing} title="Rebalance" data-rel="tooltip" disabled={status === 'REBALANCING' ? "disabled" : null}>
                      <i className="fa fa-balance-scale"></i>
                    </button>
                    <button type="button" className="btn btn-primary" onClick={this.handleTopologyKilling} title="Kill" data-rel="tooltip" disabled={status === 'KILLED' ? "disabled" : null}>
                      <i className="fa fa-ban"></i>
                    </button>
                    <button type="button" className="btn btn-primary" onClick={this.toggleSlide} title="Change Log Level" data-rel="tooltip">
                      <i className="fa fa-file-o"></i>
                    </button>
                  </div>
                </div>
              </div>
              {/*<div className="row" id="slideContent">
                <div className="col-sm-12">
                  <hr/>
                  <h4 className="col-sm-offset-5">Change Log Level</h4>
                  <p>Modify the logger levels for topology. Note that applying a setting restarts the timer in the workers. To configure the root logger, use the name ROOT.</p>
                  <Table className="table no-margin" collection={this.collection} columns={this.getColumns()}/>
                </div>
              </div>*/}
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-5">
          <div className="summary-tile">
            <div className="summary-title">Topology Summary</div>
            <div className="summary-body form-horizontal">
              <div className="form-group">
                <label className="col-sm-4 control-label">ID:</label>
                <div className="col-sm-8">
                  <p className="form-control-static">{details.id}</p>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-4 control-label">Owner:</label>
                <div className="col-sm-8">
                  <p className="form-control-static">{details.owner}</p>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-4 control-label">Status:</label>
                <div className="col-sm-8">
                  <p className="form-control-static">{details.status}</p>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-4 control-label">Uptime:</label>
                <div className="col-sm-8">
                  <p className="form-control-static">{details.uptime}</p>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-4 control-label">Workers:</label>
                <div className="col-sm-8">
                  <p className="form-control-static">{details.workersTotal}</p>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-4 control-label">Executors:</label>
                <div className="col-sm-8">
                  <p className="form-control-static">{details.executorsTotal}</p>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-4 control-label">Tasks:</label>
                <div className="col-sm-8">
                  <p className="form-control-static">{details.tasksTotal}</p>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-4 control-label">Memory:</label>
                <div className="col-sm-8">
                  <p className="form-control-static">{details.assignedTotalMem}</p>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-4 control-label">Worker-Host:Port:</label>
                <div className="col-sm-8">
                  <p className="form-control-static preformatted">{this.getWorkerData()}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div className="col-sm-7">
          <div className="stats-tile">
            <div className="stats-title">Topology Stats</div>
            <div className="stats-body">
              <Table className="table table-enlarge" noDataText="No records found." currentPage={0} >
                <Thead>
                  <Th column="windowPretty"  title="The past period of time for which the statistics apply.">Window</Th>
                  <Th column="emitted"  title="The number of Tuples emitted.">Emitted</Th>
                  <Th column="transferred"  title="The number of Tuples emitted that sent to one or more bolts.">Transferred</Th>
                  <Th column="completeLatency"  title="The average time a Tuple tree takes to be completely processed by the Topology. A value of 0 is expected if no acking is done.">Complete Latency (ms)</Th>
                  <Th column="acked"  title="The number of Tuple trees successfully processed. A value of 0 is expected if no acking is done.">Acked</Th>
                  <Th column="failed"  title="The number of Tuple trees that were explicitly failed or timed out before acking was completed. A value of 0 is expected if no acking is done.">Failed</Th>
                </Thead>
                {
                  _.map(details.topologyStats,(s,i) => {
                    return(
                      <Tr key={i}>
                        <Td column="windowPretty">{s.windowPretty}</Td>
                        <Td column="emitted">{s.emitted}</Td>
                        <Td column="transferred">{s.transferred}</Td>
                        <Td column="completeLatency">{s.completeLatency}</Td>
                        <Td column="acked">{s.acked}</Td>
                        <Td column="failed">{s.failed}</Td>
                      </Tr>
                    );
                  })
                }
              </Table>
            </div>
          </div>
        </div>
      </div>
      <Accordion defaultActiveKey="1">
        <Panel header={details.name} eventKey="1">
          <div className="graph-bg">
            <TopologyGraph
              data={graphDataObj}
            />
          </div>
        </Panel>
        <Panel header="Spouts" eventKey="2">
          <div className="input-group col-sm-4">
            <input type="text"  onKeyUp={this.handleFilter.bind(this,'spout')} className="form-control" placeholder="Search By Key" />
            <span className="input-group-btn">
            <button className="btn btn-primary" type="button"><i className="fa fa-search"></i></button>
            </span>
          </div>
          <Table className="table no-margin"  noDataText="No nimbus configuration found !"  currentPage={spotActivePage-1} itemsPerPage={pageSize}>
            <Thead>
              <Th column="spoutId" title="The ID assigned to a the Component by the Topology. Click on the name to view the Component's page.">Id</Th>
              <Th column="executors" title="Executors are threads in a Worker process.">Executors</Th>
              <Th column="tasks" title="A Task is an instance of a Bolt or Spout. The number of Tasks is almost always equal to the number of Executors.">Tasks</Th>
              <Th column="emitted" title="The number of Tuples emitted.">Emitted</Th>
              <Th column="transferred" title="The number of Tuples emitted that sent to one or more bolts.">Transferred</Th>
              <Th column="completeLatency" title="The average time a Tuple tree takes to be completely processed by the Topology. A value of 0 is expected if no acking is done.">Complete Latency (ms)</Th>
              <Th column="acked" title="The number of Tuple trees successfully processed. A value of 0 is expected if no acking is done.">Acked</Th>
              <Th column="failed" title="The number of Tuple trees that were explicitly failed or timed out before acking was completed. A value of 0 is expected if no acking is done.">Failed</Th>
              <Th column="errorHost" >Error Host:Port</Th>
              <Th column="lastError" >Last Error</Th>
              <Th column="errorTime" >Error Time</Th>
            </Thead>
            {
              _.map(spoutfilteredEntities, (s,i) => {
                return(
                  <Tr key={i}>
                    <Td column="spoutId"><Link to={`/topology/${details.id}/component/${s.spoutId}`}>{s.spoutId}</Link></Td>
                    <Td column="executors">{s.executors}</Td>
                    <Td column="tasks">{s.tasks}</Td>
                    <Td column="emitted">{s.emitted}</Td>
                    <Td column="transferred">{s.transferred}</Td>
                    <Td column="completeLatency">{s.completeLatency}</Td>
                    <Td column="acked">{s.acked}</Td>
                    <Td column="failed">{s.failed}</Td>
                    <Td column="errorHost">{s.errorHost !== '' ? s.errorHost+s.errorPort : '' }</Td>
                    <Td column="lastError">{s.lastError}</Td>
                    <Td column="errorTime">{s.errorTime !== null && s.errorTime !== 0 ? this.getDateFormat(s.errorTime) : '' }</Td>
                  </Tr>
                );
              })
            }
          </Table>
          {
            spoutfilteredEntities.length !== 0
            ? <CommonPagination  {...spotPaginationObj} callBackFunction={this.callBackFunction.bind(this)} tableName="spout"/>
            : ''
          }
        </Panel>
        <Panel header="Bolts" eventKey="3">
          <div className="input-group col-sm-4">
            <input type="text"  onKeyUp={this.handleFilter.bind(this,'bolt')} className="form-control" placeholder="Search By Key" />
            <span className="input-group-btn">
            <button className="btn btn-primary" type="button"><i className="fa fa-search"></i></button>
            </span>
          </div>
          <Table className="table no-margin"  noDataText="No nimbus configuration found !"  currentPage={boltsActivePage-1} itemsPerPage={pageSize}>
            <Thead>
              <Th column="boltId" title="The ID assigned to a the Component by the Topology. Click on the name to view the Component's page.">Id</Th>
              <Th column="executors" title="Executors are threads in a Worker process.">Executors</Th>
              <Th column="tasks" title="A Task is an instance of a Bolt or Spout. The number of Tasks is almost always equal to the number of Executors.">Tasks</Th>
              <Th column="emitted" title="The number of Tuples emitted.">Emitted</Th>
              <Th column="transferred" title="The number of Tuples emitted that sent to one or more bolts.">Transferred</Th>
              <Th column="capacity" title="If this is around 1.0, the corresponding Bolt is running as fast as it can, so you may want to increase the Bolt's parallelism. This is (number executed * average execute latency) / measurement time.">Capacity (last 10m)</Th>
              <Th column="executeLatency" title="The average time a Tuple spends in the execute method. The execute method may complete without sending an Ack for the tuple.">Execute Latency (ms)</Th>
              <Th column="executed" title="The number of incoming Tuples processed.">Executed</Th>
              <Th column="processLatency" title="The average time it takes to Ack a Tuple after it is first received.  Bolts that join, aggregate or batch may not Ack a tuple until a number of other Tuples have been received.">Process Latency (ms)</Th>
              <Th column="acked" title="The number of Tuples acknowledged by this Bolt.">Acked</Th>
              <Th column="failed" title="The number of tuples Failed by this Bolt.">Failed</Th>
              <Th column="errorHost" >Error Host:Port</Th>
              <Th column="lastError" >Last Error</Th>
              <Th column="errorTime" >Error Time</Th>
            </Thead>
            {
              _.map(blotfilteredEntities, (b,k) => {
                return(
                  <Tr key={k}>
                    <Td column="boltId"><Link to={`/topology/${details.id}/component/${b.boltId}`}>{b.boltId}</Link></Td>
                    <Td column="executors">{b.executors}</Td>
                    <Td column="tasks">{b.tasks}</Td>
                    <Td column="emitted">{b.emitted}</Td>
                    <Td column="transferred">{b.transferred}</Td>
                    <Td column="capacity">{b.capacity}</Td>
                    <Td column="executeLatency">{b.executeLatency}</Td>
                    <Td column="executed">{b.executed}</Td>
                    <Td column="processLatency">{b.processLatency}</Td>
                    <Td column="acked">{b.acked}</Td>
                    <Td column="failed">{b.failed}</Td>
                    <Td column="errorHost">{b.errorHost !== '' ? b.errorHost+b.errorPort : '' }</Td>
                    <Td column="lastError">{b.lastError}</Td>
                    <Td column="errorTime">{b.errorTime !== null && b.errorTime !== 0 ? this.getDateFormat(b.errorTime) : '' }</Td>
                  </Tr>
                );
              })
            }
          </Table>
          {
            blotfilteredEntities.length !== 0
            ? <CommonPagination  {...boltPaginationObj} callBackFunction={this.callBackFunction.bind(this)} tableName="bolt"/>
            : ''
          }
        </Panel>
        <Panel header="Topology Configuration" eventKey="4">
          <div className="input-group col-sm-4">
            <input type="text"  onKeyUp={this.handleFilter.bind(this,'topologyConfig')} className="form-control" placeholder="Search By Key" />
            <span className="input-group-btn">
            <button className="btn btn-primary" type="button"><i className="fa fa-search"></i></button>
            </span>
          </div>
          <Table className="table no-margin"  noDataText="No nimbus configuration found !"  currentPage={topologyActivePage-1} itemsPerPage={pageSize}>
            <Thead>
              <Th column="Key">Key</Th>
              <Th column="value">Value</Th>
            </Thead>
            {
              _.map(topologyfilteredEntities, (k,t) => {
                return(
                  <Tr key={t}>
                    <Td column="Key">{k}</Td>
                    <Td column="value">{details.configuration[k]}</Td>
                  </Tr>
                );
              })
            }
          </Table>
          {
            topologyfilteredEntities.length !== 0
            ? <CommonPagination  {...topologyPaginationObj} callBackFunction={this.callBackFunction.bind(this)} tableName="topologyConfig"/>
            : ''
          }
        </Panel>
      </Accordion>
    </BaseContainer>);
  }
}
