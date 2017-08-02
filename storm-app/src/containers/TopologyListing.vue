<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="box">
        <div class="box-header">
          <h4>Topology Listing</h4>
          <div v-if="fromDashboard" class="box-control">
            <router-link to="/topology" class="primary"><i class="fa fa-external-link"></i></router-link>
          </div>
        </div>
        <div :class="[{paddless: fromDashboard}, 'box-body']">
          <div v-if="!fromDashboard" class="input-group col-sm-4">
            <b-form-input v-model="filter" type="text" placeholder="Search By Topology Name"></b-form-input>
            <span class="input-group-btn">
              <button class="btn btn-primary" type="button"><i class="fa fa-search"></i></button>
            </span>
          </div>
          <div class="table-responsive">
            <b-table :busy="isBusy" :items="fetchData" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="filter" :show-empty="true">
              <!-- Custom formatted header cells -->
              <template slot="HEAD_name" scope="data">
                <b-popover triggers="hover" placement="bottom" content="The name given to the topology by when it was submitted. Click the name to view the Topology's information.">
                  {{data.label}}
                </b-popover>
              </template>
              <template slot="HEAD_status" scope="data">
                <b-popover triggers="hover" placement="bottom" content="The status can be one of ACTIVE, INACTIVE, KILLED, or REBALANCING.">
                  {{data.label}}
                </b-popover>
              </template>
              <template slot="HEAD_assignedTotalMem" scope="data">
                <b-popover triggers="hover" placement="bottom" content="Assigned Total Memory by Scheduler.">
                  {{data.label}}
                </b-popover>
              </template>
              <template slot="HEAD_workersTotal" scope="data">
                <b-popover triggers="hover" placement="bottom" content="The number of Workers (processes).">
                  {{data.label}}
                </b-popover>
              </template>
              <template slot="HEAD_executorsTotal" scope="data">
                <b-popover triggers="hover" placement="bottom" content="Executors are threads in a Worker process.">
                  {{data.label}}
                </b-popover>
              </template>
              <template slot="HEAD_tasksTotal" scope="data">
                <b-popover triggers="hover" placement="bottom" content="A Task is an instance of a Bolt or Spout. The number of Tasks is almost always equal to the number of Executors.">
                  {{data.label}}
                </b-popover>
              </template>
              <template slot="HEAD_owner" scope="data">
                <b-popover triggers="hover" placement="bottom" content="The user that submitted the Topology, if authentication is enabled.">
                  {{data.label}}
                </b-popover>
              </template>
              <template slot="HEAD_uptime" scope="data">
                <b-popover triggers="hover" placement="bottom" content="The time since the Topology was submitted.">
                  {{data.label}}
                </b-popover>
              </template>

              <!-- Custom formatted value cells -->
              <template slot="name" scope="data">
                <router-link :to="{name: 'TopologyDetail', params: {topologyId: data.item.id}}">{{data.value}}</router-link>
              </template>
              <template slot="status" scope="item">
                <span :class="item.value | statusClass">{{item.value}}</span>
              </template>
              <template slot="uptime" scope="item">
                <small>{{item.value}}</small>
              </template>
            </b-table>
          </div>
          <div v-if="!fromDashboard && tableData.length > 0" class="clearfix">
            <span>Showing {{currentPage > 1 ? (currentPage-1)*perPage+1 : currentPage }}  to {{currentPage*perPage > tableData.length ? tableData.length : (currentPage*perPage)}} of {{tableData.length}} entries.</span>
            <b-pagination size="sm" class="pull-right no-margin" :hide-goto-end-buttons="true" :total-rows="tableData.length" :per-page="perPage" v-model="currentPage" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TopologyREST from '@/rest/TopologyREST';

  export default {
    name: 'TopologyListing',
    props: ["fromDashboard"],
    created(){
      // this.fetchData();
    },
    data() {
      let tableFields = this.getTableFields();
      return {
        // tableMetadata:[
        //   {fieldName: "name", tooltip: "The name given to the topology by when it was submitted. Click the name to view the Topology's information."},
        //   {fieldName: "status", tooltip: "The status can be one of ACTIVE, INACTIVE, KILLED, or REBALANCING."},
        //   {fieldName: "assignedTotalMem", tooltip: "Assigned Total Memory by Scheduler."},
        //   {fieldName: "workersTotal", tooltip: "The number of Workers (processes)."},
        //   {fieldName: "executorsTotal", tooltip: "Executors are threads in a Worker process."},
        //   {fieldName: "tasksTotal", tooltip: "A Task is an instance of a Bolt or Spout. The number of Tasks is almost always equal to the number of Executors."},
        //   {fieldName: "owner", tooltip: "The user that submitted the Topology, if authentication is enabled."},
        //   {fieldName: "uptime", tooltip: "The time since the Topology was submitted."}
        // ],
        fields: tableFields,
        tableData: [],
        currentPage: 1,
        perPage: 2,
        filter: null,
        isBusy: false
      };
    },
    methods: {
      //Get all the table fields
      getTableFields(){
        let fields = {
          name: {label: 'Topology Name'},
          status: {label: 'Status'}
        };
        if(!this.fromDashboard) {
          let additionalFields = {
            assignedTotalMem: {label: 'Memory Assigned (MB)'},
            workersTotal: {label: 'Workers'},
            executorsTotal: {label: 'Executors'},
            tasksTotal: {label: 'Tasks'},
            owner: {label: 'Owner'}
          };
          Object.assign(fields, additionalFields);
        }
        Object.assign(fields, {uptime: {label: 'Uptime'}});
        return fields;
      },

      //Request call to get topology data
      fetchData(){
        this.isBusy = true;
        return TopologyREST.getSummary('topology').then((result) => {
          if(result.responseMessage !== undefined){
            console.error("Error in Topology Listing");
            this.isBusy = false;
          } else {
            this.isBusy = false;
            this.tableData = result.topologies;
            return this.tableData;
            // this.tableData = [
            //   {
            //     "assignedTotalMem":832.0,"owner":"storm","requestedMemOnHeap":0.0,"encodedId":"streamline-4-storm_ui-3-1500617459","assignedMemOnHeap":832.0,"id":"streamline-4-storm_ui-3-1500617459","uptime":"12d 4h 29m 13s","schedulerInfo":null,"name":"streamline-4-storm_ui","workersTotal":1,"status":"ACTIVE","requestedMemOffHeap":0.0,"tasksTotal":5,"requestedCpu":0.0,
            //     "replicationCount":1,"executorsTotal":5,"uptimeSeconds":1052953,"assignedCpu":0.0,"assignedMemOffHeap":0.0,"requestedTotalMem":0.0
            //   },
            //   {
            //     "assignedTotalMem":832.0,"owner":"storm","requestedMemOnHeap":0.0,"encodedId":"streamline-5-application1-4-1500618779","assignedMemOnHeap":832.0,"id":"streamline-5-application1-4-1500618779","uptime":"12d 4h 7m 13s","schedulerInfo":null,"name":"streamline-5-application1","workersTotal":1,"status":"ACTIVE","requestedMemOffHeap":0.0,"tasksTotal":6,"requestedCpu":0.0,
            //     "replicationCount":1,"executorsTotal":6,"uptimeSeconds":1051633,"assignedCpu":0.0,"assignedMemOffHeap":0.0,"requestedTotalMem":0.0
            //   },
            //   {
            //     "assignedTotalMem":832.0,"owner":"storm","requestedMemOnHeap":0.0,"encodedId":"streamline-4-storm_ui-3-1500617459","assignedMemOnHeap":832.0,"id":"streamline-4-storm_ui-3-1500617459","uptime":"12d 4h 29m 13s","schedulerInfo":null,"name":"streamline-6-storm_ui","workersTotal":1,"status":"ACTIVE","requestedMemOffHeap":0.0,"tasksTotal":5,"requestedCpu":0.0,
            //     "replicationCount":1,"executorsTotal":5,"uptimeSeconds":1052953,"assignedCpu":0.0,"assignedMemOffHeap":0.0,"requestedTotalMem":0.0
            //   },
            //   {
            //     "assignedTotalMem":832.0,"owner":"storm","requestedMemOnHeap":0.0,"encodedId":"streamline-5-application1-4-1500618779","assignedMemOnHeap":832.0,"id":"streamline-5-application1-4-1500618779","uptime":"12d 4h 7m 13s","schedulerInfo":null,"name":"streamline-7-application1","workersTotal":1,"status":"ACTIVE","requestedMemOffHeap":0.0,"tasksTotal":6,"requestedCpu":0.0,
            //     "replicationCount":1,"executorsTotal":6,"uptimeSeconds":1051633,"assignedCpu":0.0,"assignedMemOffHeap":0.0,"requestedTotalMem":0.0
            //   }
            // ];
          }
        });
      }
    },
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
