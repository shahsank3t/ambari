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
        this.setState({entities : results.topologies});
      }
    });
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
    return(
      <div>
        <div className="box">
            <div className="box-header">
                <h4>Topology Listing</h4>
                <div className="box-control">
                    <a className="primary" href="#!/topology"><i className="fa fa-external-link"></i></a>
                </div>
            </div>
            <div className="box-body paddless">
              <Table className="table topology-table" noDataText="No records found." currentPage={0} >
                <Thead>
                  <Th column="topologyName"  title="The name given to the topology by when it was submitted. Click the name to view the Topology's information.">Topology Name</Th>
                  <Th column="status" title="The status can be one of ACTIVE, INACTIVE, KILLED, or REBALANCING.">Status</Th>
                  <Th column="uptime" title="The time since the Topology was submitted.">Uptime</Th>
                </Thead>
                {
                  _.map(entities, (entity, i) => {
                    return (
                      <Tr key={i}>
                        <Td column="topologyName"><a href={"#!/topology/"+entity.id}>{entity.name}</a></Td>
                        <Td column="status"><span className={this.activeClass(entity.status)}>{entity.status}</span></Td>
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
