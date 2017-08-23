import ClusterSummary from './ClusterSummary';
import TopologyListing from './TopologyListing';
import SupervisorSummary from './SupervisorSummary';
import NimbusConfigSummary from './NimbusConfigSummary';

export default {
  name: 'Dashboard',
  render(){
    return (
    <div>
      <div class="row topMargin">
        <div class="col-sm-5">
          <ClusterSummary></ClusterSummary>
        </div>
        <div class="col-sm-7">
          <TopologyListing fromDashboard="true"></TopologyListing>
          <SupervisorSummary fromDashboard="true"></SupervisorSummary>
        </div>
      </div>
      <div class="row">
          <div class="col-sm-12">
            <NimbusConfigSummary></NimbusConfigSummary>
          </div>
      </div>
    </div>);
  }
};