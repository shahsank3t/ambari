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
            <b-table :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="onFilter" :show-empty="true">
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
          <div v-if="!fromDashboard && items.length > 0" class="clearfix">
            <span>Showing {{currentPage > 1 ? (currentPage-1)*perPage+1 : currentPage }}  to {{currentPage*perPage > items.length ? items.length : (currentPage*perPage)}} of {{items.length}} entries.</span>
            <b-pagination size="sm" class="pull-right no-margin" :hide-goto-end-buttons="true" :total-rows="items.length" :per-page="perPage" v-model="currentPage" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TopologyREST from '@/rest/TopologyREST';
  import FilterUtils from '@/utils/FilterUtils';

  export default {
    name: 'TopologyListing',
    props: ["fromDashboard"],
    created(){
      this.fetchData();
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
        topologiesEntities: [],
        items: [],
        currentPage: 1,
        perPage: 2,
        filter: null
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
        TopologyREST.getSummary('topology').then((result) => {
          if(result.responseMessage !== undefined){
            console.error("Error in Topology Listing");
          } else {
            this.topologiesEntities = result.topologies;
            this.items = result.topologies;
          }
        });
      },
      onFilter(filterStr){
        if(typeof filterStr === 'string'){
          this.items = this.$options.filters.filterByKey(this.topologiesEntities, filterStr, 'name');
        } else {
          return this.items;
        }
      }
    },
    filters: {
      filterByKey: FilterUtils.filterByKey,
      statusClass: FilterUtils.statusClass
    },
    watch:{
      filter(filterStr){
        this.onFilter(filterStr);
      }
    }
  };
</script>
