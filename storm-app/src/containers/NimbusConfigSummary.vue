<template>
    <dashboard-ToggleComponent :caption="title" :contentData="entity">
      <div class="box-body">
        <div class="input-group col-sm-4">
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
        </CommonTable>
      </div>

    </dashboard-ToggleComponent>
</template>

<script>
  import ToggleComponent from '@/components/ToggleComponent';
  import TopologyREST from '@/rest/TopologyREST';
  import CommonTable from '@/components/CommonTable';
  import FilterUtils from '@/utils/FilterUtils';

  export default{
    name: 'NimbusConfigSummary',
    components : {
      "dashboard-ToggleComponent" : ToggleComponent,
      'CommonTable': CommonTable
    },
    data(){
      let tableFields = this.getTableFields();
      return{
        title : "Nimbus Configuration",
        entity : {},
        fields: tableFields,
        nimbusEntities: [],
        items: [],
        filter: null,
        showPagination: true,
        tableHeaderData : [
          {fieldName: "key", tooltip: "Key"},
          {fieldName: "value", tooltip: "Value"}
        ]
      };
    },
    created(){
      this.fetchData();
    },
    methods : {
      getTableFields(){
        return {
          key: {label: 'Key'},
          value: {label: 'Value'}
        };
      },
      // data interpolation from object to arr[]
      dataInterpolation(){
        let arr=[] , self = this;
        Object.keys(this.entity).map((k) =>{
          const obj={};
          obj.key = k;
          obj.value = self.entity[k];
          arr.push(obj);
        });
        this.nimbusEntities = arr;
        this.items = arr;
      },
      // fetchData
      fetchData(){
        TopologyREST.getClusterConfig().then((result) => {
          if(result.responseMessage !== undefined){
            console.error("Error in NimbusConfigSummary");
          } else {
            this.entity = result;
          }
        });
      },
      //Filter by topology name
      onFilter(filterStr){
        if(typeof filterStr === 'string'){
          this.items = this.$options.filters.filterByKey(this.nimbusEntities, filterStr,'key');
        } else {
          return this.items;
        }
      }
    },
    filters: {
      filterByKey: FilterUtils.filterByKey
    },
    watch : {
      entity : function(){
        this.dataInterpolation();
      },
      //when filter value changes, it will call this method; being reactive
      filter(filterStr){
        this.onFilter(filterStr);
      },
      //if no data present in search result, hide pagination
      items(data){
        this.showPagination = data.length > 0;
      }
    }
  };
</script>
