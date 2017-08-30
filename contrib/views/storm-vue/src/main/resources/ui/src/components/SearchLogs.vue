<template>
  <div class="col-md-3 pull-right searchbar" :style="{'margin-bottom' : '10px'}">
    <div class="input-group">
      <input type="text" id="searchBox" class="form-control" placeholder="Search in Logs"/>
      <div class="input-group-btn">
        <div class="btn-group" role="group">
          <div class="dropdown dropdown-lg">
            <b-dropdown id="bg-nested-dropdown" variant="default" right>
              <div>
                <input type="checkbox" id="searchArchivedLogs"  value="accepted" unchecked-value="not_accepted"/>
                <label for="searchArchivedLogs">Search archived logs</label>
              </div>
              <div>
                <input type="checkbox" id="deepSearch"  value="accepted" unchecked-value="not_accepted"/>
                <label for="deepSearch">Deep search</label>
              </div>
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
    data(){
      return{};
    },
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
<style scoped>
.custom-control{
    display: block;
}
.custom-control-indicator{
  top: 4px;
  width: 12px;
  height: 12px;
  border: 1px solid #a2a2a2;
}
.searchbar label{
  font-weight: 600;
  color: #4b4b4b;
  cursor: pointer;
}

.searchbar .custom-checkbox .custom-control-input:checked ~ .custom-control-indicator{
  background-color: #dedede;
}

.searchbar .dropdown-menu input[type="checkbox"]{
  margin-right: 3px;
}
.searchbar .dropdown-toggle::after{
  margin-left: 0;
}
.dropdown-toggle::after{
  margin-left: 0 !important;
}

</style>
