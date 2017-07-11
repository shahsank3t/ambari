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

export default class NimbusConfigSummary extends Component{
  constructor(props){
    super(props);
    this.fetchData();
    this.state = {
      entity : [],
      collapse : true
    };
  }

  fetchData = () => {
    TopologyREST.getClusterConfig().then((result) => {
      if(result.responseMessage !== undefined){
        FSReactToastr.error(
          <CommonNotification flag="error" content={result.responseMessage}/>, '', toastOpt);
      } else {
        this.setState({entity : result});
      }
    });
  }

  handleFilter = () => {
    console.log('handleFilter');
  }

  handleCollapseClick = (e) => {
    this.setState({collapse : !this.state.collapse});
  }

  render(){
    const {entity,collapse} = this.state;
    return(
      <div className="box node-accordian">
        <div className={`box-header ${collapse ? 'collapsed' : ''}`}  data-toggle="collapse" data-target="#collapseBody" aria-expanded={`${collapse ? false : true}`} aria-controls="collapseBody" onClick={this.handleCollapseClick.bind(this)}>
          <h4>Nimbus Configuration</h4>
          <div className="box-control">
            <a href="javascript:void(0);" className="primary"><i className="fa fa-expand" id="collapseTable"></i></a>
          </div>
        </div>
        <div className={`box-body collapse ${collapse ? '' : 'in'}`} aria-expanded={`${collapse ? false : true}`}>
          <div className="input-group col-sm-4">
            <input type="text"  onKeyUp={this.handleFilter.bind(this)}  className="form-control" placeholder="Search By Key" />
            <span className="input-group-btn">
              <button className="btn btn-primary" type="button"><i className="fa fa-search"></i></button>
            </span>
          </div>
          <Table className="table no-margin"  noDataText="No nimbus configuration found !"  currentPage={0}>
            <Thead>
              <Th column="Key">Key</Th>
              <Th column="value">Value</Th>
            </Thead>
            {
              _.map(_.keys(entity), (k,i) => {
                return(
                  <Tr key={i}>
                    <Td column="Key">{k}</Td>
                    <Td column="value">{entity[k]}</Td>
                  </Tr>
                );
              })
            }
          </Table>
        </div>
      </div>
    );
  }
}
