import React, {Component} from 'react';
import _ from 'lodash';
import {
  Table,
  Thead,
  Th,
  Tr,
  Td,
  unsafe
} from 'reactable';
import FSReactToastr from '../components/FSReactToastr';
import {toastOpt} from '../utils/Constants';
import TopologyREST from '../rest/TopologyREST';
import CommonNotification from '../components/CommonNotification';
import {Link} from 'react-router';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import Breadcrumbs from '../components/Breadcrumbs';

export default class TopologyListing extends Component{
  constructor(props){
    super(props);
    this.fetchData();
    this.state = {
      entities : []
    };
  }

  fetchData = () => {
    TopologyREST.getSummary('topology').then((results) => {
      if(results.responseMessage !== undefined){
        FSReactToastr.error(
          <CommonNotification flag="error" content={results.responseMessage}/>, '', toastOpt);
      } else {
        let stateObj={};
        stateObj.entities = results.topologies;
        if(!this.props.fromDashboard){
          var additionalColumns = [
            {name: 'assignedTotalMem', title: 'Memory Assigned (MB)', tooltip:'Assigned Total Memory by Scheduler.'},
            {name: 'workersTotal', title: 'Workers', tooltip:'The number of Workers (processes).'},
            {name: 'executorsTotal', title: 'Executors', tooltip:'Executors are threads in a Worker process.'},
            {name: 'tasksTotal', title: 'Tasks', tooltip:'A Task is an instance of a Bolt or Spout. The number of Tasks is almost always equal to the number of Executors.'},
            {name: 'owner', title: 'Owner', tooltip:'The user that submitted the Topology, if authentication is enabled.'}
          ];
          Array.prototype.push.apply(stateObj.entities, additionalColumns);
        }
        this.setState({entities : stateObj.entities});
      }
    });
  }

  getLinks(){
    var links = [
      {link: '#/', title: 'Dashboard'},
      {link: '#/topology', title: 'Topology Listing'}
    ];
    return links;
  }

  activeClass = (status) => {
    let classname="label ";
    switch(status){
    case 'ACTIVE':
      classname += "label-success";
      break;
    case 'INACTIVE':
      classname += "label-default";
      break;
    case 'REBALANCING':
      classname += "label-warning";
      break;
    case 'KILLED':
      classname += "label-danger";
      break;
    default:
      classname += "label-primary";
      break;
    }
    return classname;
  }

  render(){
    const {entities} = this.state;
    const {fromDashboard} = this.props;
    const topologies = _.filter(entities, (e)=>{return e.id !== undefined;});
    return(
      <div className={fromDashboard ? "" : "container-fluid"}>
        {!fromDashboard ? <Breadcrumbs links={this.getLinks()} /> : ''}
        <div className="box">
            <div className="box-header">
                <h4>Topology Listing</h4>
                {fromDashboard ?
                <div className="box-control">
                    <a className="primary" href="#/topology"><i className="fa fa-external-link"></i></a>
                </div>
                : ''}
            </div>
            <div className="box-body paddless">
              <Table className="table topology-table" noDataText="No records found." currentPage={0} >
                <Thead>
                  <Th column="topologyName"><OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip1">The name given to the topology by when it was submitted. Click the name to view the Topology's information.</Tooltip>}><span>Topology Name</span></OverlayTrigger></Th>
                  <Th column="status"><OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip1">The status can be one of ACTIVE, INACTIVE, KILLED, or REBALANCING.</Tooltip>}><span>Status</span></OverlayTrigger></Th>
                  {
                    !fromDashboard
                    ? [
                      <Th key={3} column="assignedTotalMem" title="Assigned Total Memory by Scheduler.">Memory Assigned (MB)</Th>,
                      <Th key={4} column="workersTotal" title="The number of Workers (processes).">Workers</Th>,
                      <Th key={5} column="executorsTotal" title="Executors are threads in a Worker process.">Executors</Th>,
                      <Th key={6} column="tasksTotal" title="A Task is an instance of a Bolt or Spout. The number of Tasks is almost always equal to the number of Executors.">Tasks</Th>,
                      <Th key={7} column="owner" title="The user that submitted the Topology, if authentication is enabled.">Owner</Th>,
                      <Th key={8} column="uptime" title="The time since the Topology was submitted.">Uptime</Th>
                    ]
                    : <Th column="uptime"><OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip1">The time since the Topology was submitted.</Tooltip>}><span>Uptime</span></OverlayTrigger></Th>
                  }
                </Thead>
                {
                  _.map(topologies, (entity, i) => {
                    return (
                      <Tr key={i}>
                        <Td column="topologyName"><Link to={"topology/"+entity.id}>{entity.name}</Link></Td>
                        <Td column="status"><span className={this.activeClass(entity.status)}>{entity.status}</span></Td>
                        {
                          !fromDashboard
                          ? [
                            <Td key={i+'assignedTotalMem'} column="assignedTotalMem">{entity.assignedTotalMem}</Td>,
                            <Td key={i+'workersTotal'} column="workersTotal">{entity.workersTotal}</Td>,
                            <Td key={i+'executorsTotal'} column="executorsTotal">{entity.executorsTotal}</Td>,
                            <Td key={i+'tasksTotal'} column="tasksTotal">{entity.tasksTotal}</Td>,
                            <Td key={i+'owner'} column="owner">{entity.owner}</Td>
                          ]
                          : ''
                        }
                        <Td column="uptime"><small>{entity.uptime}</small></Td>
                      </Tr>
                    );
                  })
                }
              </Table>
            </div>
        </div>
      </div>
    );
  }
}
