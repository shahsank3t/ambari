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
        <template scope="data" :slot="headData.isCustom ? headData.fieldName : ''" v-for="headData in tableHeaderData">
          <slot :item="data" :name="'__'+headData.fieldName+'__'"></slot>
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
  export default {
    name: 'TableComponent',
    props: ["items", "fields", "classname", "showPagination", "tableHeaderData"],
    data(){
      return {
        currentPage: 1,
        perPage: 25
      };
    },
    watch: {},
    filters: {},
    methods: {}
  };
</script>
