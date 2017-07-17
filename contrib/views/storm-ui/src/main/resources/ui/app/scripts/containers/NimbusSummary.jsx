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
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import Breadcrumbs from '../components/Breadcrumbs';

export default class NimbusSummary extends Component{
  constructor(props){
    super(props);
    this.fetchData();
    this.state = {
      entities : []
    };
  }

  fetchData = () => {
    TopologyREST.getSummary('nimbus').then((results) => {
      if(results.responseMessage !== undefined){
        FSReactToastr.error(
          <CommonNotification flag="error" content={results.responseMessage}/>, '', toastOpt);
      } else {
        this.setState({entities : results.nimbuses});
      }
    });
  }

  getLinks(){
    var links = [
      {link: '#/', title: 'Dashboard'},
      {link: '#/nimbus', title: 'Nimbus Summary'}
    ];
    return links;
  }

  activeClass = (status) => {
    let classname="label ";
    switch(status){
    case 'Leader':
      classname += "label-success";
      break;// case 'Follower':
    //   classname += "label-warning";
    //   break;default:
      classname += "label-warning";
      break;
    }
    return classname;
  }

  render(){
    const {entities} = this.state;
    const {fromDashboard} = this.props;
    return(
      <div className={fromDashboard ? "" : "container-fluid"}>
        {!fromDashboard ? <Breadcrumbs links={this.getLinks()} /> : ''}
        <div className="box">
            <div className="box-header">
                <h4>Nimbus Summary</h4>
                {fromDashboard ?
                <div className="box-control">
                  <a className="primary" href="#/nimbus"><i className="fa fa-external-link"></i></a>
                </div>
                : ''}
            </div>
            <div className="box-body paddless">
              <Table className="table topology-table" noDataText="No records found." currentPage={0} >
                <Thead>
                  <Th column="host:Port"><OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip1">Nimbus hostname and port number</Tooltip>}><span>Host:Port</span></OverlayTrigger></Th>
                  <Th column="status"><OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip1">Leader if this host is leader, Not a Leader for all other live hosts, note that these hosts may or may not be in leader lock queue, and Dead for hosts that are part of nimbus.seeds list but are not alive.</Tooltip>}><span>Status</span></OverlayTrigger></Th>
                  <Th column="uptime"><OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip1">Time since this nimbus host has been running.</Tooltip>}><span>Uptime</span></OverlayTrigger></Th>
                </Thead>
                {
                  _.map(entities, (entity, i) => {
                    return (
                      <Tr key={i}>
                        <Td column="host:Port"><a href={entity.nimbusLogLink} target="_blank">{entity.host+':'+entity.port}</a></Td>
                        <Td column="status"><span className={this.activeClass(entity.status)}>{entity.status}</span></Td>
                        <Td column="uptime"><small>{entity.nimbusUpTime}</small></Td>
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
