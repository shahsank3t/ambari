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

  render(){
    const {entities} = this.state;
    return(
      <div>
        <div className="box">
            <div className="box-header">
                <h4>Supervisor Summary</h4>
                <div className="box-control">
                    <a className="primary" href="#/supervisor"><i className="fa fa-external-link"></i></a>
                </div>
            </div>
            <div className="box-body paddless">
              <Table className="table no-margin supervisor-table" noDataText="No records found." currentPage={0} >
                <Thead>
                  <Th column="host"  title="The hostname reported by the remote host. (Note that this hostname is not the result of a reverse lookup at the Nimbus node.)">Host</Th>
                  <Th column="slots" title="Slots are Workers (processes).">Slots</Th>
                  <Th column="cpu" title="CPU that has been allocated.">CPU</Th>
                  <Th column="memory" title="Memory that has been allocated.">Memory</Th>
                  <Th column="uptime" title="The length of time a Supervisor has been registered to the cluster.">Uptime</Th>
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
