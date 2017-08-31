<template>
  <div>
    <app-Breadcrumbs v-if="!fromDashboard" :items="linkList"></app-Breadcrumbs>
    <div class="box">
      <div class="box-header">
        <h4>Supervisor Summary</h4>
        <div v-if="fromDashboard" class="box-control">
          <router-link to="/supervisor" class="primary"><i class="fa fa-external-link"></i></router-link>
        </div>
      </div>
      <div :class="[{paddless: fromDashboard}, 'box-body']" :style="{height : fetchLoader ? '100px' : 'auto'}">
        <template v-if="fetchLoader">
          <div class="loading-img text-center">
            <img src="static/img/start-loader.gif" alt="loading" :style="{width : '50px'}"/>
          </div>
        </template>
        <template v-else>
          <div v-if="!fromDashboard" class="input-group col-sm-4">
            <b-form-input v-model="filter" type="text" placeholder="Search By Host"></b-form-input>
            <span class="input-group-btn">
              <button class="btn btn-primary" type="button"><i class="fa fa-search"></i></button>
            </span>
          </div>
          <CommonTable
            classname='no-margin supervisor-table'
            :items="items"
            :fields="fields"
            :showPagination="showPagination"
            :tableHeaderData="tableHeaderData"
          >
            <!-- Custom formatted value cells -->
            <template slot="__hostName__" scope="{item}">
              <a :href="item.item.logLink" target="_blank">{{item.item.host}}</a>
            </template>
            <template slot="__slots__" scope="{item}">
              <app-supervisorsummary-radial
                :graphData="[item.item.slotsUsed,item.item.slotsTotal]"
                :labels="labels" :width="width" :height="height"
                :innerRadius="innerRadius"
                :outerRadius="outerRadius" :color="color"></app-supervisorsummary-radial>
            </template>
            <template slot="__cpu__" scope="{item}">
              <app-supervisorsummary-radial
                :graphData="[item.item.usedCpu,item.item.totalCpu]"
                :labels="labels" :width="width" :height="height"
                :innerRadius="innerRadius"
                :outerRadius="outerRadius" :color="color"></app-supervisorsummary-radial>
            </template>
            <template slot="__memory__" scope="{item}">
              <app-supervisorsummary-radial
                :graphData="[item.item.usedMem,item.item.totalMem]"
                :labels="labels" :width="width" :height="height"
                :innerRadius="innerRadius"
                :outerRadius="outerRadius" :color="color"></app-supervisorsummary-radial>
            </template>
            <template scope="{item}" slot="__uptime__">
              <small>{{item.value}}</small>
            </template>
          </CommonTable>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import TopologyREST from '@/rest/TopologyREST';
  import FilterUtils from '@/utils/FilterUtils';
  import RadialChart from '@/components/RadialChart';
  import CommonTable from '@/components/CommonTable';
  import Breadcrumbs from '@/components/Breadcrumbs';
  import FSToaster from '@/utils/FSToaster';

  export default {
    name: 'SupervisorSummary',
    props: ["fromDashboard"],
    created(){
      this.fetchData();
    },

    data() {
      let tableFields = this.getTableFields();
      return {
        tableHeaderData:[
          {fieldName: "hostName", tooltip: "The hostname reported by the remote host. (Note that this hostname is not the result of a reverse lookup at the Nimbus node.)", isCustom: true},
          {fieldName: "slots", tooltip: "Slots are Workers (processes).", isCustom: true},
          {fieldName: "cpu", tooltip: "CPU that has been allocated.", isCustom: true},
          {fieldName: "memory", tooltip: "Memory that has been allocated.", isCustom: true},
          {fieldName: "uptime", tooltip: "The length of time a Supervisor has been registered to the cluster.", isCustom: true}
        ],
        fields: tableFields,
        entities: [],
        items: [],
        filter: null,
        labels : ['Used','Total'],
        width : null,
        height : null,
        innerRadius :19,
        outerRadius : 21,
        color: ["#bcbcbc", "#235693"],
        showPagination: !this.fromDashboard ? true : false,
        linkList : this.getLinks(),
        fetchLoader : true
      };
    },

    mounted(){
      FilterUtils.handleLoader();
    },

    updated(){
      FilterUtils.handleLoader();
    },

    methods: {
      //Get all the table fields
      getTableFields(){
        let fields = {
          hostName: {label: 'Host'},
          slots: {label: 'Slots'},
          cpu: {label: 'CPU'},
          memory: {label: 'Memory'},
          uptime: {label: 'Uptime'}
        };
        return fields;
      },

      //Request call to get nimbus data
      fetchData(){
        TopologyREST.getSummary('supervisor').then((result) => {
          if(result.responseMessage !== undefined){
            FSToaster.error("Error in SupervisorSummary");
          } else {
            this.entities = result.supervisors;
            this.items = result.supervisors;
            this.fetchLoader = false;
          }
        });
      },

      onFilter(filterStr){
        if(typeof filterStr === 'string'){
          this.items = this.$options.filters.filterByKey(this.entities, filterStr, 'host');
        } else {
          return this.items;
        }
      },

      getLinks(){
        var links = [
          {link: '#/', title: 'Dashboard'},
          {link: '#/supervisor', title: 'Supervisor Summary'}
        ];
        return links;
      }

    },
    components : {
      'app-supervisorsummary-radial' : RadialChart,
      'CommonTable': CommonTable,
      'app-Breadcrumbs' : Breadcrumbs
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
