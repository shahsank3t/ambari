import Vue from 'vue';
import Router from 'vue-router';

import { routePaths } from '@/utils/Constants';

import Dashboard from '@/containers/Dashboard';
import TopologyListing from '@/containers/TopologyListing';
import NimbusConfigSummary from '@/containers/NimbusConfigSummary';
import SupervisorSummary from '@/containers/SupervisorSummary';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: routePaths.DASHBOARD.path,
      name: routePaths.DASHBOARD.name,
      component: Dashboard
    },
    {
      path: routePaths.TOPOLOGY_LISTING.path,
      name: routePaths.TOPOLOGY_LISTING.name,
      component: TopologyListing
    },
    {
      path: routePaths.TOPOLOGY_DETAIL.path,
      name: routePaths.TOPOLOGY_DETAIL.name,
      component: NimbusConfigSummary
    },
    {
      path: routePaths.NIMBUS.path,
      name: routePaths.NIMBUS.name,
      component: NimbusConfigSummary
    },
    {
      path: routePaths.SUPERVISOR.path,
      name: routePaths.SUPERVISOR.name,
      component: SupervisorSummary
    }
  ]
});
