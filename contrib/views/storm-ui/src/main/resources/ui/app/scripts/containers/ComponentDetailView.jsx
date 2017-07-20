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
import CommonWindowPanel from '../components/CommonWindowPanel';
import Modal from '../components/FSModel';
import ProfilingView from '../components/ProfilingView';

export default class ComponentDetailView extends Component {
  constructor(props){
    super(props);
    this.state = {
      componentDetail: {},
      inputStatsActivePage: 1,
      outputStatsActivePage: 1,
      executorStatsActivePage: 1,
      componentErrorsActivePage: 1,
      selectedWindowKey : {label : 'All time' , value : ':all-time'},
      windowOptions : [],
      systemFlag : false,
      debugFlag : false,
      outputStatsFilter : '',
      executorStatsFilter : '',
      componentErrorsFilter : ''
    };
    this.fetchDetails();
  }

  fetchDetails(){
    const {selectedWindowKey,systemFlag} = this.state;
    TopologyREST.getTopologyComponentDetail(this.props.params.id, this.props.params.name,selectedWindowKey.value,systemFlag).then((res) => {
      let stateObj={};
      stateObj.componentDetail = res;
      stateObj.spoutFlag = stateObj.componentDetail.componentType === 'spout' ? true: false;
      stateObj.samplingPct = stateObj.componentDetail.samplingPct;
      stateObj.windowOptions = Utils.populateWindowsOptions(stateObj.spoutFlag ? stateObj.componentDetail.spoutSummary : stateObj.componentDetail.boltStats);
      stateObj.topologyStatus = stateObj.componentDetail.topologyStatus;
      this.setState(stateObj);
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
    const {componentDetail,spoutFlag} = this.state;
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

  handleFilter(type,event){
    let tempState = _.cloneDeep(this.state);
    tempState[type+'Filter'] = event.target.value;
    this.setState(tempState);
  }

  callBackFunction(type,eventKey){
    let tempState = _.cloneDeep(this.state);
    tempState[type+'ActivePage'] = eventKey;
    this.setState(tempState);
  }

  getContent(type, noDataText){
    const activePage = this.state[type+'ActivePage'];
    const fiterValue = this.state[type+'Filter'];
    const typeArr = this.state.componentDetail[type];
    const key = type === 'outputStats'
                  ? 'stream'
                  : type === 'executorStats'
                    ? 'id'
                    : type === 'inputStats'
                      ? 'component'
                      : 'errorTime';
    const FilteredEntities = Utils.filterByKey(typeArr || [],fiterValue,key);

    const PaginationObj = {
      activePage: activePage,
      pageSize,
      filteredEntities : FilteredEntities
    };

    return <div>
            <div className="input-group col-sm-4">
              <input type="text"  onKeyUp={this.handleFilter.bind(this,type)} className="form-control" placeholder="Search By Key" />
              <span className="input-group-btn">
                <button className="btn btn-primary" type="button"><i className="fa fa-search"></i></button>
              </span>
            </div>
            {
              this['get'+type+'Table'](FilteredEntities, activePage, noDataText)
            }
            {
              (FilteredEntities.length !== 0
                ? <CommonPagination  {...PaginationObj} callBackFunction={this.callBackFunction.bind(this,type)} tableName={type}/>
                : '')
            }
          </div>;
  }

  getinputStatsTable(FilteredEntities, activePage, noDataText){
    const {componentDetail,spoutFlag} = this.state;

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
    const {componentDetail,spoutFlag} = this.state;

    return(
    <Table className="table no-margin"  noDataText={noDataText}  currentPage={activePage-1} itemsPerPage={pageSize}>
      <Thead>
        <Th column="stream" title="The name of the Tuple stream given in the Topolgy, or &#34;default&#34; if none was given.">Stream</Th>
        <Th column="emitted" title="The number of Tuples emitted.">Emitted</Th>
        <Th column="transferred" title="The number of Tuples emitted that sent to one or more bolts.">Transferred</Th>
        {
          spoutFlag
          ? [
            <Th key={1} column="completeLatency" title="The average time a Tuple &#34;tree&#34; takes to be completely processed by the Topology. A value of 0 is expected if no acking is done.">Complete Latency (ms)</Th>,
            <Th key={2} column="acked" title="The number of Tuple &#34;trees&#34; successfully processed. A value of 0 is expected if no acking is done.">Acked</Th>,
            <Th key={3} column="failed" title="The number of Tuple &#34;trees&#34; that were explicitly failed or timed out before acking was completed. A value of 0 is expected if no acking is done.">Failed</Th>
          ]
          : <Th key={4} column=""></Th>
        }
      </Thead>
      {
        _.map(FilteredEntities, (d,i) => {
          return (
            <Tr key={i}>
              <Td column="stream">{d.stream}</Td>
              <Td column="emitted">{d.emitted}</Td>
              <Td column="transferred">{d.transferred}</Td>
              {
                spoutFlag
                ? [
                  <Td key={i+'completeLatency'} column="completeLatency">{d.completeLatency}</Td>,
                  <Td key={i+'acked'} column="acked">{d.acked}</Td>,
                  <Td key={i+'failed'} column="failed">{d.failed}</Td>
                ]
                : null
              }
            </Tr>
          );
        })
      }
    </Table>
    );
  }

  getexecutorStatsTable(FilteredEntities, activePage, noDataText){
    const {componentDetail,spoutFlag} = this.state;

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
          <Th key={1} column="capacity" title="If this is around 1.0, the corresponding Bolt is running as fast as it can, so you may want to increase the Bolt's parallelism. This is (number executed * average execute latency) / measurement time.">Capacity (last 10m)</Th>,
          <Th key={2} column="executeLatency" title=" average time a Tuple spends in the execute method. The execute method may complete without sending an Ack for the tuple.">Execute Latency (ms)</Th>,
          <Th key={3} column="executed" title="The number of incoming Tuples processed.">Executed</Th>,
          <Th key={4} column="processLatency" title="The average time it takes to Ack a Tuple after it is first received.  Bolts that join, aggregate or batch may not Ack a tuple until a number of other Tuples have been received.">Process Latency (ms</Th>,
          <Th key={5} column="completeLatency" title="The average time a Tuple &#34;tree&#34; takes to be completely processed by the Topology. A value of 0 is expected if no acking is done.">Complete Latency (ms)</Th>
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
                <Td key={i+'capacity'} column="capacity">{d.capacity}</Td>,
                <Td key={i+'executeLatency'} column="executeLatency">{d.executeLatency}</Td>,
                <Td key={i+'executed'} column="executed">{d.executed}</Td>,
                <Td key={i+'processLatency'} column="processLatency">{d.processLatency}</Td>
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

  handleWindowChange = (obj) => {
    if(!_.isEmpty(obj)){
      this.setState({selectedWindowKey : obj}, () => {
        this.fetchDetails();
      });
    }
  }

  handleModelAction = (modalType,action) => {
    if(action === 'save'){
      switch(modalType){
      case 'debugModelRef' : this.handleDebugSave(modalType,'enable');;
        break;
      default : Utils.hideFSModal.call(this,modalType);
        break;
      }
    } else{
      switch(modalType){
      case 'debugModelRef' : Utils.hideFSModal.call(this,modalType,'callBack').then((res) => {
        this.setState({debugFlag : !this.state.debugFlag});
      });
        break;
      default : Utils.hideFSModal.call(this,modalType);
        break;
      }
    }
  }

  debugEnableConfirmBox = (confirm,modalType) => {
    if(!confirm){
      this.refs.BaseContainer.refs.Confirm.show({title: 'Do you really want to stop debugging this topology ?"'}).then((confirmBox) => {
        this.setState({debugSimplePCT : 0}, () => {
          this.handleDebugSave(modalType,'disable');
          confirmBox.cancel();
        });
      }, () => {
        this.setState({debugFlag : true});
      });
    }
  }

  handleDebugSave = (modal,toEnableFlag) => {
    const {samplingPct,componentDetail} = this.state;
    Utils.hideFSModal.call(this,modal);
    const componentID = componentDetail.topologyId+'/component/'+componentDetail.id;
    TopologyREST.postDebugTopology(componentID,toEnableFlag,samplingPct).then((result) => {
      if(result.responseMessage !== undefined){
        this.setState({samplingPct : componentDetail.samplingPct});
        FSReactToastr.error(
          <CommonNotification flag="error" content={result.responseMessage}/>, '', toastOpt);
      } else {
        FSReactToastr.success(<strong>Debugging enabled successfully.</strong>);
      }
    });
  }

  toggleSystem = (toggleStatus) => {
    let stateObj = _.cloneDeep(this.state);
    stateObj[toggleStatus] = !stateObj[toggleStatus];
    this.setState(stateObj,() => {
      if(toggleStatus === 'debugFlag'){
        !stateObj.debugFlag ? this.debugEnableConfirmBox(stateObj.debugFlag,'debugModelRef') : this.refs.debugModelRef.show();
      } else {
        this.fetchDetails();
      }
    });
  }

  inputTextChange = (type,e) => {
    let stateObj = _.cloneDeep(this.state);
    stateObj[type] = e.target.value;
    this.setState(stateObj);
  }

  handleProfiling = () => {
    this.refs.profileModelRef.show();
  }

  render(){
    const {componentDetail, InputStatsActivePage, OutputStatsActivePage, ExecutorStatsActivePage, ErrorStatsActivePage,
      inputStatsFilter, outputStatsFilter, executorStatsFilter, errorStatsFilter,
    selectedWindowKey,windowOptions,systemFlag,debugFlag,topologyStatus,spoutFlag,samplingPct} = this.state;
    return (
    <BaseContainer>
      <Breadcrumbs links={this.getLinks()} />
      <SearchLogs
        id={this.props.params.id}
      />
      <div className="row">
        <div className="col-sm-12">
          <div className="box filter">
            <div className="box-body form-horizontal">
              <CommonWindowPanel KYC="componentView" selectedWindowKey={selectedWindowKey} windowOptions={windowOptions}  systemFlag={systemFlag} debugFlag={debugFlag} handleWindowChange={this.handleWindowChange.bind(this)} toggleSystem={this.toggleSystem.bind(this)} topologyStatus={topologyStatus} handleProfiling={this.handleProfiling.bind(this)}/>
            </div>
          </div>
        </div>
      </div>
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
      {componentDetail.inputStats
        ?
        <Panel defaultExpanded collapsible header={"Input Stats ("+ componentDetail.windowHint +")"} eventKey="1">
          {this.getContent('inputStats', 'No input stats found!')}
        </Panel>
        :
        null
      }
      {componentDetail.outputStats
        ?
        <Panel defaultExpanded collapsible header={"Output Stats ("+ componentDetail.windowHint +")"} eventKey="2">
          {this.getContent('outputStats', 'No output stats found!')}
        </Panel>
        :
        null
      }
      {componentDetail.executorStats
        ?
        <Panel defaultExpanded collapsible header={"Executor Stats ("+ componentDetail.windowHint +")"} eventKey="3">
          {this.getContent('executorStats', 'No executor stats found!')}
        </Panel>
        :
        null
      }
      {componentDetail.componentErrors
        ?
        <Panel defaultExpanded collapsible header={"Error Stats ("+ componentDetail.windowHint +")"} eventKey="4">
          {this.getContent('componentErrors', 'No errors found!')}
        </Panel>
        :
        null
      }

      {/*Model start here*/}
      <Modal ref={"debugModelRef"} data-title="Do you really want to debug this topology ? If yes, please, specify sampling percentage."  data-resolve={this.handleModelAction.bind(this,'debugModelRef','save')} data-reject={this.handleModelAction.bind(this,'debugModelRef','hide')}>
        <input className="form-control" type="number" min={0} max={Number.MAX_SAFE_INTEGER} value={samplingPct} onChange={this.inputTextChange.bind(this,'samplingPct')}/>
      </Modal>

      <Modal ref={"profileModelRef"} hideFooter={true} data-title="Profiling & Debugging"  data-resolve={this.handleModelAction.bind(this,'profileModelRef','save')} data-reject={this.handleModelAction.bind(this,'profileModelRef','hide')}>
        <ProfilingView topologyId={componentDetail.topologyId} executorStats={componentDetail.executorStats} />
      </Modal>

    </BaseContainer>
    );
  }
}
