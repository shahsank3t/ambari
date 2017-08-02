<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="box">
        <div class="box-header">
          <h4>Topology Listing</h4>
        </div>
        <div class="box-body">
          <div class="input-group col-sm-4">
            <b-form-input v-model="filter" type="text" placeholder="Search By Topology Name"></b-form-input>
            <span class="input-group-btn">
              <button class="btn btn-primary" type="button"><i class="fa fa-search"></i></button>
            </span>
          </div>
          <div class="table-responsive">
            <b-table :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="filter">
              <template slot="name" scope="item">
                <router-link :to="{name: 'TopologyDetail', params: {topologyId: item.value}}">{{item.value}}</router-link>
              </template>
              <template slot="status" scope="item">
                <span :class="item.value | statusClass">{{item.value}}</span>
              </template>
              <template slot="uptime" scope="item">
                <small>{{item.value}}</small>
              </template>
            </b-table>
          </div>
          <div class="clearfix">
            <b-pagination size="sm" class="pull-right no-margin" hide-goto-end-buttons="true" :total-rows="items.length" :per-page="perPage" v-model="currentPage" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TopologyListing',
    data() {
      return {
        items: [
          {
            "assignedTotalMem":832.0,"owner":"storm","requestedMemOnHeap":0.0,"encodedId":"streamline-4-storm_ui-3-1500617459","assignedMemOnHeap":832.0,"id":"streamline-4-storm_ui-3-1500617459","uptime":"12d 4h 29m 13s","schedulerInfo":null,"name":"streamline-4-storm_ui","workersTotal":1,"status":"ACTIVE","requestedMemOffHeap":0.0,"tasksTotal":5,"requestedCpu":0.0,
            "replicationCount":1,"executorsTotal":5,"uptimeSeconds":1052953,"assignedCpu":0.0,"assignedMemOffHeap":0.0,"requestedTotalMem":0.0
          },
          {
            "assignedTotalMem":832.0,"owner":"storm","requestedMemOnHeap":0.0,"encodedId":"streamline-5-application1-4-1500618779","assignedMemOnHeap":832.0,"id":"streamline-5-application1-4-1500618779","uptime":"12d 4h 7m 13s","schedulerInfo":null,"name":"streamline-5-application1","workersTotal":1,"status":"ACTIVE","requestedMemOffHeap":0.0,"tasksTotal":6,"requestedCpu":0.0,
            "replicationCount":1,"executorsTotal":6,"uptimeSeconds":1051633,"assignedCpu":0.0,"assignedMemOffHeap":0.0,"requestedTotalMem":0.0
          }
        ],
        fields: {
          name: {
            label: 'Topology Name'
          },
          status: {
            label: 'Status'
          },
          assignedTotalMem: {
            label: 'Memory Assigned (MB)'
          },
          workersTotal: {
            label: 'Workers'
          },
          executorsTotal: {
            label: 'Executors'
          },
          tasksTotal: {
            label: 'Tasks'
          },
          owner: {
            label: 'Owner'
          },
          uptime: {
            label: 'Uptime'
          }
        },
        currentPage: 1,
        perPage: 5,
        filter: null
      };
    },
    methods: {},
    filters: {
      statusClass(status){
        let classname = "label ";
        switch(status){
        case 'ACTIVE':
          classname += "label-success";
          break;
        case 'INACTIVE':
          classname += "label-default";
          break;
        case 'REBALANCING':
          classname += "label-warning";
          break;
        case 'KILLED':
          classname += "label-danger";
          break;
        default:
          classname += "label-primary";
          break;
        }
        return classname;
      }
    }
  };
</script>
