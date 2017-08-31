import ClusterSummary from './ClusterSummary';
import TopologyListing from './TopologyListing';
import SupervisorSummary from './SupervisorSummary';
import NimbusConfigSummary from './NimbusConfigSummary';
import FilterUtils from '@/utils/FilterUtils';

export default {
  name: 'Dashboard',
  mounted(){
    FilterUtils.handleLoader();
  },
  updated(){
    FilterUtils.handleLoader();
  },
  render(){
    return (
    <section>
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
    </section>);
  }
};
