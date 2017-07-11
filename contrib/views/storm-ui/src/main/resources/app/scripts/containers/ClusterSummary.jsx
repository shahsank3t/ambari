import React, {Component} from 'react';
import RadialChart  from '../components/RadialChart';
import FSReactToastr from '../components/FSReactToastr';
import {toastOpt} from '../utils/Constants';
import TopologyREST from '../rest/TopologyREST';
import NimbusSummary from './NimbusSummary';

export default class ClusterSummary extends Component{
  constructor(props){
    super(props);
    this.fetchData();
    this.state = {
      entity :{}
    };
  }

  fetchData = () => {
    TopologyREST.getSummary('cluster').then((result) => {
      if(result.responseMessage !== undefined){
        FSReactToastr.error(
          <CommonNotification flag="error" content={result.responseMessage}/>, '', toastOpt);
      } else {
        this.setState({entity : result});
      }
    });
  }
  render(){
    const {entity} = this.state;
    return(
      <div>
        <div className="row">
          <div className="col-sm-6">
              <div className="tile primary" title="Executors are threads in a Worker process." data-rel="tooltip1">
                  <div className="tile-header">Executor</div>
                  <div className="tile-body">
                      <i className="fa fa-play-circle-o"></i>
                      <span className="count">{entity.executorsTotal}</span>
                  </div>
              </div>
          </div>
          <div className="col-sm-6">
              <div className="tile warning" title="A Task is an instance of a Bolt or Spout. The number of Tasks is almost always equal to the number of Executors." data-rel="tooltip1">
                  <div className="tile-header">Tasks</div>
                  <div className="tile-body">
                      <i className="fa fa-tasks"></i>
                      <span className="count">{entity.tasksTotal}</span>
                  </div>
              </div>
          </div>
      </div>
      <div className="row">
            <div className="col-sm-6">
                <div className="tile success" title="The number of nodes in the cluster currently." data-rel="tooltip1">
                    <div className="tile-header" style={{textAlign:"center"}}>Supervisor</div>
                    <div className="tile-body" style={{textAlign:"center"}}>
                        <div id="supervisorCount">
                          <RadialChart
                            data={[entity.supervisors,entity.supervisors]}
                            labels={['Used','Total']}
                            width={100}
                            height={100}
                            innerRadius={46}
                            outerRadius={50}
                            color={["rgba(255,255,255,0.6)", "rgba(255,255,255,1)"]}
                          />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-sm-6">
                <div className="tile danger" title="Slots are Workers (processes)." data-rel="tooltip1">
                    <div className="tile-header" style={{textAlign:"center"}}>Slots</div>
                    <div className="tile-body" style={{textAlign:"center"}}>
                        <div id="slotsCount">
                          <RadialChart
                            data={[entity.slotsUsed,entity.slotsTotal]}
                            labels={['Used','Total']}
                            width={100}
                            height={100}
                            innerRadius={46}
                            outerRadius={50}
                            color={["rgba(255,255,255,0.6)", "rgba(255,255,255,1)"]}
                          />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <NimbusSummary />
          </div>
        </div>
      </div>
    );
  }
}
