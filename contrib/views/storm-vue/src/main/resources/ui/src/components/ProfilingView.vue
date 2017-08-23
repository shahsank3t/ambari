<template>
  <div>
    <div class="alert alert-warning alert-dismissible warning-msg" :class="warnMsg ? '' : 'hidden'"  role="alert">
      <strong>Warning!</strong> Please select atleast one worker to perform operation.
    </div>
    <div class="alert alert-success alert-dismissible success-msg" :class="successMsg ? '' : 'hidden'"  role="alert">
      <strong>Success!</strong> Action performed successfully.
    </div>
    <div class="alert alert-danger alert-dismissible error-msg" :class="errorMsg ? '' : 'hidden'" role="alert">
      <strong>Error!</strong> Error occured while performing the action.
    </div>
    <div class="clearfix">
      <div class="btn-group btn-group-sm pull-right">
        <button type="button" class="btn btn-primary" @click="commonBtnAction('dumpjstack')">JStack</button>
        <button type="button" class="btn btn-primary" @click="commonBtnAction('restartworker')">Restart Worker</button>
        <button type="button" class="btn btn-primary" @click="commonBtnAction('dumpheap')">Heap</button>
      </div>
    </div>
    <hr />
    <app-CommonTable
      classname='no-margin'
      :items="executorArr"
      :fields="profileFields"
      :showPagination="false"
      :tableHeaderData="profileHeaderData"
      >

      <template scope="{item}" slot="HEAD__checkBoxField__">
        <input type="checkbox" :checked="selectAll" name="header" @click.stop="handleChange(null)"/>
      </template>

      <template scope="{item}" slot="__checkBoxField__">
        <input type="checkbox" :checked="item.item.checked" name="single" @click.stop="handleChange(item.item.hostPort)"/>
      </template>

    </app-CommonTable>
  </div>
</template>
<script>

  import TopologyREST from '@/rest/TopologyREST';
  import CommonTable from '@/components/CommonTable';

  export default{
    name : "ProfilingView",
    props : ["topologyId","executorStats"],
    components : {
      "app-CommonTable" : CommonTable
    },

    data(){
      return{
        executorArr :[],
        selectedWorker : [],
        selectAll : false,
        warnMsg : false,
        successMsg : false,
        errorMsg : false,
        profileFields : this.getProfileFields(),
        profileHeaderData : this.getProfileHeaderData()
      };
    },

    created(){
      this.executorArr = this.executorStats ? this.fetchData() : [];
    },

    methods : {
      fetchData(){
        const {executorStats} = this;
        let data = {},executorArr=[];
        _.map(executorStats, (o) => {
          const hostPort = o.host + ":" + o.port;
          if(!data[hostPort]){
            data[hostPort] = {};
          }
          if(!data[hostPort].idArr){
            data[hostPort].idArr = [];
          }
          data[hostPort].idArr.push(o.id);
        });
        let keys = this.hostPortArr = _.keys(data);
        _.map(keys, (k) => {
          executorArr.push({
            hostPort: k,
            executorId: data[k].idArr.toString(),
            checked : false
          });
        });
        return executorArr;
      },

      commonBtnAction(actionType){
        const {selectedWorker} = this;
        if(selectedWorker.length){
          this.apiCallback(actionType);
        } else {
          this.warnMsg = true;
          this.successMsg = false;
          this.errorMsg = false;
        }
      },

      apiCallback(actionType) {
        const {topologyId,selectedWorker} = this;
        let promiseArr=[];
        _.map(selectedWorker, (w) => {
          promiseArr.push(TopologyREST.getProfiling(topologyId,actionType,w.hostPort));
        });

        Promise.all(promiseArr).then((results) => {
          _.map(results, (r) => {
            if(r.responseMessage !== undefined){
              this.errorMsg = true;
            } else {
              this.successMsg = true;
            }
            this.errorMsg = false;
            this.warnMsg = false;
          });
        });
      },

      handleChange(hostPort) {
        let tempSelect = _.cloneDeep(this.selectAll);
        let tempExecutor=_.cloneDeep(this.executorArr);
        let tempWorker = _.cloneDeep(this.selectedWorker);
        if(!!hostPort){
          const ind = _.findIndex(tempExecutor, (e) => {return e.hostPort === hostPort; });
          const index = _.findIndex(tempWorker,(t) => {return t.hostPort === hostPort;});
          if(index === -1 && ind !== -1){
            tempWorker.push(tempExecutor[ind]);
          } else {
            tempWorker.splice(index,1);
          }
          tempExecutor[ind].checked = !tempExecutor[ind].checked;
        } else {
          tempSelect = !this.selectAll;
          _.map(tempExecutor,(t) => {
            t.checked = tempSelect;
          });
          tempWorker = tempExecutor;
        }
        this.selectedWorker = tempWorker;
        this.selectAll = tempSelect;
        this.executorArr = tempExecutor;
      },

      getProfileFields(){
        return {
          checkBoxField : {label : "CheckBox"},
          hostPort : {label : "Host:Port"},
          executorId : {label : "Executor Id"}
        };
      },

      getProfileHeaderData(){
        return[
          {fieldName : "checkBoxField" , isCustom : true,customHead :true},
          {fieldName : "hostPort" },
          {fieldName : "executorId" }
        ];
      }

    }
  };
</script>
