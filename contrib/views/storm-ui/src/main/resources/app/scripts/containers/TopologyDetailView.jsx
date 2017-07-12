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

export default class TopologyDetailView extends Component {
  constructor(props){
    super(props);
    this.state = {
      details: {}
    };
    this.fetchDetails();
  }
  fetchDetails(){
    TopologyREST.getTopologyDetails(this.props.params.id)
      .then((res) => {
        this.setState({details: res});
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
  render() {
    const {details} = this.state;
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
                  <p className="form-control-static preformatted">{this.state.workerHostPort}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
        {/*<div className="col-sm-7">
          <div className="stats-tile">
            <div className="stats-title">Topology Stats</div>
            <div className="stats-body">
              <table className="table table-enlarge">
                <thead>
                  <tr>
                    <th><span data-rel="tooltip" title="The past period of time for which the statistics apply.">Window</span></th>
                    <th><span data-rel="tooltip" title="The number of Tuples emitted.">Emitted</span></th>
                    <th><span data-rel="tooltip" title="The number of Tuples emitted that sent to one or more bolts.">Transferred</span></th>
                    <th><span data-rel="tooltip" title='The average time a Tuple "tree" takes to be completely processed by the Topology. A value of 0 is expected if no acking is done.'>Complete Latency (ms)</span></th>
                    <th><span data-rel="tooltip" title='The number of Tuple "trees" successfully processed. A value of 0 is expected if no acking is done.'>Acked</span></th>
                    <th><span data-rel="tooltip" title='The number of Tuple "trees" that were explicitly failed or timed out before acking was completed. A value of 0 is expected if no acking is done.'>Failed</span></th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderStatsRow()}
                </tbody>
              </table>
            </div>
          </div>
        </div>*/}
      </div>
      <Accordion defaultActiveKey="1">
        <Panel header={details.name} eventKey="1">
          <div className="graph-bg">
            <TopologyGraph
              data={JSON.parse('{"25-KAFKA":{":type":"spout",":capacity":0,":latency":null,":transferred":0,":stats":[{":host":"sanket-selenium-3.openstacklocal",":port":6700,":uptime_secs":3473854,":transferred":{"600":{"s__system1771886016":0},"10800":{"s__system1771886016":0},"86400":{"s__system1771886016":0},":all-time":{"s__system1771886016":0}}}],":link":"/component.html?id=25-KAFKA&topology_id=streamline-29-app1-2-1496379412",":inputs":[{":component":"__acker",":stream":"__ack_ack",":sani-stream":"s__ack_ack643800921",":grouping":"direct"},{":component":"__acker",":stream":"__ack_fail",":sani-stream":"s__ack_fail1900808674",":grouping":"direct"},{":component":"__acker",":stream":"__ack_reset_timeout",":sani-stream":"s__ack_reset_timeout929063677",":grouping":"direct"}]},"26-RULE":{":type":"bolt",":capacity":0,":latency":null,":transferred":null,":stats":[{":host":"sanket-selenium-3.openstacklocal",":port":6700,":uptime_secs":3473854,":transferred":{}}],":link":"/component.html?id=26-RULE&topology_id=streamline-29-app1-2-1496379412",":inputs":[{":component":"25-KAFKA",":stream":"kafka_stream_25",":sani-stream":"kafka_stream___2027926772",":grouping":"local-or-shuffle"}]},"__system":{":type":"spout",":capacity":0,":latency":null,":transferred":null,":stats":[],":link":"/component.html?id=__system&topology_id=streamline-29-app1-2-1496379412",":inputs":[]},"__metricsorg.apache.hadoop.metrics2.sink.storm.StormTimelineMetricsSink":{":type":"spout",":capacity":0,":latency":null,":transferred":null,":stats":[],":link":"/component.html?id=__metricsorg.apache.hadoop.metrics2.sink.storm.StormTimelineMetricsSink&topology_id=streamline-29-app1-2-1496379412",":inputs":[{":component":"__system",":stream":"__metrics_aggregate",":sani-stream":"s__metrics_aggregate1124229964",":grouping":"shuffle"}]},"__acker":{":type":"spout",":capacity":0,":latency":null,":transferred":null,":stats":[],":link":"/component.html?id=__acker&topology_id=streamline-29-app1-2-1496379412",":inputs":[{":component":"25-KAFKA",":stream":"__ack_init",":sani-stream":"s__ack_init2096470730",":grouping":"fields"},{":component":"26-RULE",":stream":"__ack_fail",":sani-stream":"s__ack_fail1900808674",":grouping":"fields"},{":component":"26-RULE",":stream":"__ack_reset_timeout",":sani-stream":"s__ack_reset_timeout929063677",":grouping":"fields"},{":component":"26-RULE",":stream":"__ack_ack",":sani-stream":"s__ack_ack643800921",":grouping":"fields"}]}}')}
            />
          </div>
        </Panel>
        <Panel header="Spouts" eventKey="2">
          Spouts
        </Panel>
        <Panel header="Bolts" eventKey="3">
          Bolts
        </Panel>
        <Panel header="Topology Configuration" eventKey="4">
          Topology Configuration
        </Panel>
      </Accordion>
    </BaseContainer>);
  }
}