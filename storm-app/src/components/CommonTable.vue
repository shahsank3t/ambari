<template>
  <div>
    <div class="table-responsive">
      <b-table
        :class=classname
        :items=items
        :fields=fields
        :current-page=currentPage
        :per-page=perPage
        :show-empty="true"
      >
        <!-- Custom formatted header cells -->
        <template scope="data" :slot="'HEAD_'+headData.fieldName" v-for="headData in tableHeaderData">
          <b-popover triggers="hover" placement="bottom" :content="headData.tooltip">
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
    <div v-if="showPagination && items.length > 0" class="clearfix">
      <span>Showing {{currentPage > 1 ? (currentPage-1)*perPage+1 : currentPage }}  to {{currentPage*perPage > items.length ? items.length : (currentPage*perPage)}} of {{items.length}} entries.</span>
      <b-pagination
        size="sm"
        class="pull-right no-margin"
        :hide-goto-end-buttons="true"
        :total-rows="items.length"
        :per-page="perPage"
        v-model="currentPage"
      />
    </div>
  </div>
</template>

<script>
  import FilterUtils from '@/utils/FilterUtils';

  export default {
    name: 'TableComponent',
    props: ["items", "fields", "classname", "showPagination", "tableHeaderData"],
    data(){
      return {
        currentPage: 1,
        perPage: 2
      };
    },
    watch: {},
    filters: {
      statusClass: FilterUtils.statusClass
    },
    methods: {}
  };
</script>
