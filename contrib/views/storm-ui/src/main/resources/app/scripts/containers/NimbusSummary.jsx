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
    return(
      <div>
        <div className="box">
            <div className="box-header">
                <h4>Nimbus Summary</h4>
                <div className="box-control">
                    <a className="primary" href="#!/topology"><i className="fa fa-external-link"></i></a>
                </div>
            </div>
            <div className="box-body paddless">
              <Table className="table topology-table" noDataText="No records found." currentPage={0} >
                <Thead>
                  <Th column="host:Port"  title="Nimbus hostname and port number">Host:Port</Th>
                  <Th column="status" title="Leader if this host is leader, Not a Leader for all other live hosts, note that these hosts may or may not be in leader lock queue, and Dead for hosts that are part of nimbus.seeds list but are not alive.">Status</Th>
                  <Th column="uptime" title="Time since this nimbus host has been running.">Uptime</Th>
                </Thead>
                {
                  _.map(entities, (entity, i) => {
                    return (
                      <Tr key={i}>
                        <Td column="host:Port"><a href={entity.nimbusLogLink}>{entity.host+':'+entity.port}</a></Td>
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
