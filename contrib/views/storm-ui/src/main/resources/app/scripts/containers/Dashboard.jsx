import React, {Component} from 'react';
import BaseContainer from './BaseContainer';
import ClusterSummary from './ClusterSummary';
import TopologyListing from './TopologyListing';
import NimbusConfigSummary from './NimbusConfigSummary';
import SupervisorSummary from './SupervisorSummary';

export default class Dashboard extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BaseContainer>
        <div className="row" style={{marginTop: '20px'}}>
          <div className="col-sm-5">
            <ClusterSummary />
          </div>
          <div className="col-sm-7">
            <TopologyListing fromDashboard={true} />
            <SupervisorSummary />
          </div>
        </div>
        <div className="row">
            <div className="col-sm-12">
              <NimbusConfigSummary />
            </div>
        </div>
      </BaseContainer>
    );
  }
}
