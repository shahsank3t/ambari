<template>
	<div class="row">
    <div class="col-sm-12">
    <div class="box">
      <div class="box-header">
        <h4>Nimbus Summary</h4>
        <div v-if="fromDashboard" class="box-control">
          <router-link to="/nimbus" class="primary"><i class="fa fa-external-link"></i></router-link>
        </div>
      </div>
      <div :class="[{paddless: fromDashboard}, 'box-body']">
        <div v-if="!fromDashboard" class="input-group col-sm-4">
          <b-form-input v-model="filter" type="text" placeholder="Search By Host"></b-form-input>
          <span class="input-group-btn">
            <button class="btn btn-primary" type="button"><i class="fa fa-search"></i></button>
          </span>
        </div>
        <div class="table-responsive">
          <b-table :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="onFilter" :show-empty="true">
              <!-- Custom formatted header cells -->
              <template slot="HEAD_hostName" scope="data">
                <b-popover triggers="hover" placement="bottom" content="Nimbus hostname and port number">
                  {{data.label}}
                </b-popover>
              </template>
              <template slot="HEAD_status" scope="data">
                <b-popover triggers="hover" placement="bottom" content="Leader if this host is leader, Not a Leader for all other live hosts, note that these hosts may or may not be in leader lock queue, and Dead for hosts that are part of nimbus.seeds list but are not alive.">
                  {{data.label}}
                </b-popover>
              </template>
              <template slot="HEAD_uptime" scope="data">
                <b-popover triggers="hover" placement="bottom" content="Time since this nimbus host has been running.">
                  {{data.label}}
                </b-popover>
              </template>

              <!-- Custom formatted value cells -->
              <template slot="hostName" scope="data">
                <a :href="data.item.nimbusLogLink" target="_blank">{{data.item.host+':'+data.item.port}}</a>
              </template>
              <template slot="status" scope="item">
                <span :class="item.value | statusClass">{{item.value}}</span>
              </template>
              <template slot="uptime" scope="data">
                <small>{{data.item.nimbusUpTime}}</small>
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
    name: 'NimbusSummary',
    props: ["fromDashboard"],
    created(){
      this.fetchData();
    },

    data() {
      let tableFields = this.getTableFields();
      return {
        fields: tableFields,
        entities: [],
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
          hostName: {label: 'Host:Port'},
          status: {label: 'Status'},
          uptime: {label: 'Uptime'}
        };
        return fields;
      },

      //Request call to get nimbus data
      fetchData(){
        TopologyREST.getSummary('nimbus').then((result) => {
          if(result.responseMessage !== undefined){
            console.error("Error in NimbusSummary");
          } else {
            this.entities = result.nimbuses;
            this.items = result.nimbuses;
          }
        });
      },

      onFilter(filterStr){
        if(typeof filterStr === 'string'){
          this.items = this.$options.filters.filterByKey(this.entities, filterStr, 'host');
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