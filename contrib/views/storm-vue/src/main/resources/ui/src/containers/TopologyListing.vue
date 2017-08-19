<template>
  <div>
    <app-Breadcrumbs v-if="!fromDashboard" :items="linkList"></app-Breadcrumbs>
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
        <CommonTable
          classname='no-margin'
          :items="items"
          :fields="fields"
          :showPagination="showPagination"
          :tableHeaderData="tableHeaderData"
        >
          <!-- Custom formatted value cells -->
          <template scope="{item}" slot="__name__">
            <router-link :to="{name: 'TopologyDetail', params: {topologyId: item.item.id}}">{{item.value}}</router-link>
          </template>
          <template scope="{item}" slot="__status__">
            <span :class="item.value | statusClass">{{item.value}}</span>
          </template>
          <template scope="{item}" slot="__uptime__">
            <small>{{item.value}}</small>
          </template>
        </CommonTable>
      </div>
    </div>
  </div>
</template>

<script>
  import TopologyREST from '@/rest/TopologyREST';
  import FilterUtils from '@/utils/FilterUtils';
  import CommonTable from '@/components/CommonTable';
  import Breadcrumbs from '@/components/Breadcrumbs';

  export default {
    name: 'TopologyListing',
    components: {
      'CommonTable': CommonTable,
      'app-Breadcrumbs' : Breadcrumbs
    },
    props: ["fromDashboard"],
    created(){
      this.fetchData();
    },
    data() {
      let tableFields = this.getTableFields();
      return {
        tableHeaderData:[
          {fieldName: "name", tooltip: "The name given to the topology by when it was submitted. Click the name to view the Topology's information.", isCustom: true},
          {fieldName: "status", tooltip: "The status can be one of ACTIVE, INACTIVE, KILLED, or REBALANCING.", isCustom: true},
          {fieldName: "assignedTotalMem", tooltip: "Assigned Total Memory by Scheduler."},
          {fieldName: "workersTotal", tooltip: "The number of Workers (processes)."},
          {fieldName: "executorsTotal", tooltip: "Executors are threads in a Worker process."},
          {fieldName: "tasksTotal", tooltip: "A Task is an instance of a Bolt or Spout. The number of Tasks is almost always equal to the number of Executors."},
          {fieldName: "owner", tooltip: "The user that submitted the Topology, if authentication is enabled."},
          {fieldName: "uptime", tooltip: "The time since the Topology was submitted.", isCustom: true}
        ],
        fields: tableFields,
        topologiesEntities: [],
        items: [],
        filter: null,
        showPagination: !this.fromDashboard ? true : false,
        linkList : this.getLinks()
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

      //Filter by topology name
      onFilter(filterStr){
        if(typeof filterStr === 'string'){
          this.items = this.$options.filters.filterByKey(this.topologiesEntities, filterStr, 'name');
        } else {
          return this.items;
        }
      },

      getLinks(){
        var links = [
          {link: '#/', title: 'Dashboard'},
          {link: '#/topology', title: 'Topology Listing'}
        ];
        return links;
      }
    },
    filters: {
      filterByKey: FilterUtils.filterByKey,
      statusClass: FilterUtils.statusClass
    },
    watch:{
      //when filter value changes, it will call this method; being reactive
      filter(filterStr){
        this.onFilter(filterStr);
      },
      //if no data present in search result, hide pagination
      items(data){
        this.showPagination = !this.fromDashboard && data.length > 0;
      }
    }
  };
</script>
