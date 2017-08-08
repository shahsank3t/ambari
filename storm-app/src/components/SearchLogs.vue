<template>
  <div class="col-md-3 pull-right searchbar">
    <div class="input-group">
      <input type="text" id="searchBox" class="form-control" placeholder="Search in Logs"/>
      <div class="input-group-btn">
        <div class="btn-group" role="group">
          <div class="dropdown dropdown-lg">
            <b-dropdown id="bg-nested-dropdown" variant="default" right class="m-md-2">
             <b-dropdown-item href="javascript:void(0)" :active="false">
               <b-form-checkbox id="searchArchivedLogs"  value="accepted" unchecked-value="not_accepted">
                 Search archived logs
               </b-form-checkbox>
             </b-dropdown-item>
             <b-dropdown-item href="javascript:void(0)" :active="false">
               <b-form-checkbox id="deepSearch"  value="accepted" unchecked-value="not_accepted">
                 Deep search
               </b-form-checkbox>
             </b-dropdown-item>
           </b-dropdown>
          </div>
          <button type="button" class="btn btn-default" @click="handleSearch">
            <i class="fa fa-search"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {baseUrl} from '@/utils/Constants';
  
  export default{
    name : "SearchLogs",
    props : ["topologyId"],
    methods : {
      handleSearch(){
        var searchBoxEl = document.getElementById('searchBox');
        var searchArchivedLogsEl = document.getElementById('searchArchivedLogs');
        var deepSearchEl = document.getElementById('deepSearch');
        var topologyId = this.topologyId;

        fetch(baseUrl.replace('proxy?url=/api/v1/', 'storm_details'), {"credentials": "same-origin"})
          .then((response) => {
            return response.json();
          })
          .then((response) => {
            var url = response.hostdata+'/';
            if(deepSearchEl.checked == true){
              url += "deep_search_result.html";
            }else{
              url += "search_result.html";
            }
            url += '?search='+searchBoxEl.value+'&id='+ topologyId +'&count=1';
            if(searchArchivedLogsEl.checked == true){
              if(deepSearchEl.checked == true){
                url += "&search-archived=on";
              }else{
                url += "&searchArchived=checked";
              }
            }
            window.open(url, '_blank');

            searchBoxEl.value = '';
            searchArchivedLogsEl.checked = false;
            deepSearchEl.checked = false;
          });
      }
    }
  };
</script>
<style scope>
.m-md-2{
  margin: 0 !important;
}
</style>
