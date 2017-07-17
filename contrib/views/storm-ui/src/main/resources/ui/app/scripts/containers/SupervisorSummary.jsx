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
import RadialChart  from '../components/RadialChart';
import FSReactToastr from '../components/FSReactToastr';
import {toastOpt} from '../utils/Constants';
import TopologyREST from '../rest/TopologyREST';
import CommonNotification from '../components/CommonNotification';
import Breadcrumbs from '../components/Breadcrumbs';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

export default class SupervisorSummary extends Component{
  constructor(props){
    super(props);
    this.fetchData();
    this.state = {
      entities : []
    };
  }

  fetchData = () => {
    TopologyREST.getSummary('supervisor').then((results) => {
      if(results.responseMessage !== undefined){
        FSReactToastr.error(
          <CommonNotification flag="error" content={results.responseMessage}/>, '', toastOpt);
      } else {
        this.setState({entities : results.supervisors});
      }
    });
  }

  getLinks(){
    var links = [
      {link: '#/', title: 'Dashboard'},
      {link: '#/supervisor', title: 'Supervisor Summary'}
    ];
    return links;
  }

  render(){
    const {entities} = this.state;
    const {fromDashboard} = this.props;
    return(
      <div className={fromDashboard ? "" : "container-fluid"}>
        {!fromDashboard ? <Breadcrumbs links={this.getLinks()} /> : ''}
        <div className="box">
            <div className="box-header">
                <h4>Supervisor Summary</h4>
                {fromDashboard ?
                <div className="box-control">
                    <a className="primary" href="#/supervisor"><i className="fa fa-external-link"></i></a>
                </div>
                : ''}
            </div>
            <div className="box-body paddless">
              <Table className="table no-margin supervisor-table" noDataText="No records found." currentPage={0} >
                <Thead>
                  <Th column="host"><OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip1">The hostname reported by the remote host. (Note that this hostname is not the result of a reverse lookup at the Nimbus node.)</Tooltip>}><span>Host</span></OverlayTrigger></Th>
                  <Th column="slots"><OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip1">Slots are Workers (processes).</Tooltip>}><span>Slots</span></OverlayTrigger></Th>
                  <Th column="cpu"><OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip1">CPU that has been allocated.</Tooltip>}><span>CPU</span></OverlayTrigger></Th>
                  <Th column="memory"><OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip1">Memory that has been allocated.</Tooltip>}><span>Memory</span></OverlayTrigger></Th>
                  <Th column="uptime"><OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip1">The length of time a Supervisor has been registered to the cluster.</Tooltip>}><span>Uptime</span></OverlayTrigger></Th>
                </Thead>
                {
                  _.map(entities, (entity, i) => {
                    return (
                      <Tr key={i}>
                        <Td column="host"><a href={entity.logLink} target="_blank">{entity.host}</a></Td>
                        <Td column="slots">
                          <RadialChart
                            data={[entity.slotsUsed,entity.slotsTotal]}
                            labels={['Used','Total']}
                            innerRadius={19}
                            outerRadius={21}
                            color={["#bcbcbc", "#235693"]}
                          />
                        </Td>
                        <Td column="cpu">
                          <RadialChart
                            data={[entity.usedCpu,entity.totalCpu]}
                            labels={['Used','Total']}
                            innerRadius={19}
                            outerRadius={21}
                            color={["#bcbcbc", "#235693"]}
                          />
                        </Td>
                        <Td column="memory">
                          <RadialChart
                            data={[entity.usedMem,entity.totalMem]}
                            labels={['Used','Total']}
                            innerRadius={19}
                            outerRadius={21}
                            color={["#bcbcbc", "#235693"]}
                          />
                        </Td>
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
