<template>
  <div>
    <div class="row topMargin">
      <div class="col-sm-5">
        <app-clusterSummary></app-clusterSummary>
      </div>
      <div class="col-sm-7">
        <app-topologListing :fromDashboard="true"></app-topologListing>
        <app-supervisorSummary></app-supervisorSummary>
      </div>
    </div>
    <div class="row">
        <div class="col-sm-12">
          <app-nimbusConfigSummary></app-nimbusConfigSummary>
        </div>
    </div>
  </div>
</template>
<script>
  import ClusterSummary from './ClusterSummary';
  import TopologyListing from './TopologyListing';
  import SupervisorSummary from './SupervisorSummary';
  import NimbusConfigSummary from './NimbusConfigSummary';

  export default {
    name: 'Dashboard',
    components: {
      'app-clusterSummary': ClusterSummary,
      'app-topologListing': TopologyListing,
      'app-supervisorSummary': SupervisorSummary,
      'app-nimbusConfigSummary': NimbusConfigSummary
    }
  };
</script>

<style scope>
.topMargin{
  margin-top: 20px;
}
</style>
