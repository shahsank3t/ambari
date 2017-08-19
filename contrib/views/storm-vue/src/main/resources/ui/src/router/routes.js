import Vue from 'vue';
import Router from 'vue-router';

import { routePaths } from '@/utils/Constants';

import Dashboard from '@/containers/Dashboard';
import TopologyListing from '@/containers/TopologyListing';
import NimbusConfigSummary from '@/containers/NimbusConfigSummary';
import SupervisorSummary from '@/containers/SupervisorSummary';
import NimbusSummary from '@/containers/NimbusSummary';
import TopologyDetailView from '@/containers/TopologyDetailView';
import ComponentDetailView from '@/containers/ComponentDetailView';

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
      component: TopologyDetailView
    },
    {
      path: routePaths.NIMBUS.path,
      name: routePaths.NIMBUS.name,
      component: NimbusSummary
    },
    {
      path: routePaths.SUPERVISOR.path,
      name: routePaths.SUPERVISOR.name,
      component: SupervisorSummary
    },
    {
      path: routePaths.COMPONENT_DETAIL.path,
      name: routePaths.COMPONENT_DETAIL.name,
      component: ComponentDetailView
    }
  ]
});
