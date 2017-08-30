<template>
  <div>
    <app-Breadcrumbs v-if="!fromDashboard" :items="linkList"></app-Breadcrumbs>
    <div class="box">
      <div class="box-header">
        <h4>Nimbus Summary</h4>
        <div v-if="fromDashboard" class="box-control">
          <router-link to="/nimbus" class="primary"><i class="fa fa-external-link"></i></router-link>
        </div>
      </div>
      <div :class="[{paddless: fromDashboard}, 'box-body']"  :style="{height : fetchLoader ? '70px' : 'auto'}">
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
          <CommonTable classname='no-margin' :items="items" :fields="fields" :showPagination="showPagination" :tableHeaderData="tableHeaderData">
            <!-- Custom formatted value cells -->
            <template scope="{item}" slot="__hostName__">
              <a :href="item.item.nimbusLogLink" target="_blank">{{item.item.host+':'+item.item.port}}</a>
            </template>
            <template scope="{item}" slot="__status__">
              <span :class="item.value | statusClass">{{item.value}}</span>
            </template>
            <template scope="{item}" slot="__uptime__">
              <small>{{item.item.nimbusUpTime}}</small>
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
  import CommonTable from '@/components/CommonTable';
  import Breadcrumbs from '@/components/Breadcrumbs';
  import FSToaster from '@/utils/FSToaster';

  export default {
    name: 'NimbusSummary',
    components: {
      'CommonTable': CommonTable,
      'app-Breadcrumbs' : Breadcrumbs
    },
    props: ["fromDashboard"],
    created() {
      this.fetchData();
    },

    data() {
      let tableFields = this.getTableFields();
      return {
        tableHeaderData: [
          {fieldName: "hostName",tooltip: "Nimbus hostname and port number",isCustom: true},
          {fieldName: "status",tooltip: "Leader if this host is leader, Not a Leader for all other live hosts, note that these hosts may or may not be in leader lock queue, and Dead for hosts that are part of nimbus.seeds list but are not alive.",isCustom: true},
          {fieldName: "uptime",tooltip: "Time since this nimbus host has been running.",isCustom: true}
        ],
        fields: tableFields,
        entities: [],
        items: [],
        filter: null,
        showPagination: !this.fromDashboard ? true : false,
        linkList : this.getLinks(),
        fetchLoader : true
      };
    },

    methods: {
      //Get all the table fields
      getTableFields() {
        let fields = {
          hostName: {label: 'Host:Port'},
          status: {label: 'Status'},
          uptime: {label: 'Uptime'}
        };
        return fields;
      },

      //Request call to get nimbus data
      fetchData() {
        TopologyREST.getSummary('nimbus').then((result) => {
          if (result.responseMessage !== undefined) {
            FSToaster.error("Error in NimbusSummary");
          } else {
            this.entities = result.nimbuses;
            this.items = result.nimbuses;
            this.fetchLoader = false;
          }
        });
      },

      onFilter(filterStr) {
        if (typeof filterStr === 'string') {
          this.items = this.$options.filters.filterByKey(this.entities, filterStr, 'host');
        } else {
          return this.items;
        }
      },

      getLinks(){
        var links = [
          {link: '#/', title: 'Dashboard'},
          {link: '#/nimbus', title: 'Nimbus Summary'}
        ];
        return links;
      }

    },
    filters: {
      filterByKey: FilterUtils.filterByKey,
      statusClass: FilterUtils.statusClass
    },
    watch: {
      filter(filterStr) {
        this.onFilter(filterStr);
      }
    }
  };
</script>
