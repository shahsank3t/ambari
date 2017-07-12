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
import {toastOpt,pageSize} from '../utils/Constants';
import TopologyREST from '../rest/TopologyREST';
import CommonNotification from '../components/CommonNotification';
import Utils from '../utils/Utils';
import CommonPagination from '../components/CommonPagination';
import {Accordion,Panel} from 'react-bootstrap';

export default class NimbusConfigSummary extends Component{
  constructor(props){
    super(props);
    this.fetchData();
    this.state = {
      entity : [],
      filterValue: '',
      collapse : true,
      activePage : 1
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

  handleFilter = (e) => {
    this.setState({filterValue: e.target.value.trim()});
  }

  handleCollapseClick = (e) => {
    this.setState({collapse : !this.state.collapse});
  }

  callBackFunction = (eventKey) => {
    this.setState({activePage : eventKey});
  }

  render(){
    const {entity,collapse,filterValue,activePage} = this.state;
    const filteredEntities = Utils.filterByKey(_.keys(entity), filterValue);
    const paginationObj = {
      activePage,
      pageSize,
      filteredEntities
    };

    const panelHeader = <div>
                          <h4 style={{marginTop:0,marginBottom:0}}>Nimbus Configuration
                            <div className="box-control pull-right">
                              <a href="javascript:void(0);" className="primary"><i className="fa fa-expand" id="collapseTable"></i></a>
                            </div>
                          </h4>
                        </div>;

    return(
      <Accordion>
        <Panel header={panelHeader} eventKey="1">
          <Table className="table no-margin"  noDataText="No nimbus configuration found !"  currentPage={activePage-1} itemsPerPage={pageSize}>
            <Thead>
              <Th column="Key">Key</Th>
              <Th column="value">Value</Th>
            </Thead>
            {
              _.map(filteredEntities, (k,i) => {
                return(
                  <Tr key={i}>
                    <Td column="Key">{k}</Td>
                    <Td column="value">{entity[k]}</Td>
                  </Tr>
                );
              })
            }
          </Table>
          {
            filteredEntities.length !== 0
            ? <CommonPagination  {...paginationObj} callBackFunction={this.callBackFunction.bind(this)}/>
            : ''
          }
        </Panel>
      </Accordion>
    );
  }
}
