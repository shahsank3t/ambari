<template>
  <div class="boxAnimated">
      <hr/>
      <h4 class="col-sm-offset-5">Change Log Level</h4>
      <p>Modify the logger levels for topology. Note that applying a setting restarts the timer in the workers. To configure the root logger, use the name ROOT.</p>
  </div>
</template>
<script>
  import TopologyREST from '@/rest/TopologyREST';
  import _ from 'lodash';
  import Editable from '@/components/Editable';
  import CommonTable from '@/components/CommonTable';
  import FilterUtils from '@/utils/FilterUtils';

  export default{
    name : "LogLevelComponent",
    props :["topologyId"],
    components : {
      "app-Editable" : Editable
    },
    data(){
      return{
        logLevelObj : {},
        traceOption : this.populateTraceOptions(),
        selectedKeyName : 'com.your.organization.LoggerName',
        selectedTrace : 'ALL',
        selectedTimeOut : 30,
        keyName : '',
        timeChange : ''
      };
    },
    created(){
      this.fetchData();
    },
    methods : {
      fetchData(){
        const {topologyId} = this;
        let self = this;
        TopologyREST.getLogConfig(topologyId).then((result) => {
          if(result.responseMessage !== undefined){
            console.error(result.responseMessage);
          } else {
            self.selectedKeyName = 'com.your.organization.LoggerName';
            self.selectedTrace = 'ALL';
            self.selectedTimeOut = 30;
            self.logLevelObj = result.namedLoggerLevels;
          }
        });
      },

      populateTraceOptions(){
        let temp=[];
        const arr = ['ALL','TRACE','DEBUG','INFO','WARN','ERROR','FATAL','OFF'];
        _.map(arr, (a) => {
          temp.push({label : a, value : a});
        });
        return temp;
      },

      handleNameChange(event){
        this.keyName =  event.target.value.trim();
      },

      handleTimeChange(event){
        this.timeChange =  event.target.value.trim();
      },

      traceLavelChange(type,key,addRow,obj){
        let tempKeyName = 'ALL';
        if(!!addRow){
          tempKeyName = obj.value;
        } else{
          this.logLevelObj[type][key] = obj.value;
        }
        this.selectedTrace = tempKeyName;
      },

      modifyCommonObjValue(refType,type,key,action,addRow){
        if(action === 'save' && addRow === null){
          this.logLevelObj[type][key] = parseInt(this.timeChange,10);
        } else if(action === 'save' && !!addRow){
          this.selectedTimeOut = parseInt(this.timeChange, 10);
        }
        this.refs[refType].hideEditor();
        this.timeChange = '';
      },

      getDateFormat(str){
        const d = new Date(str);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
      },

      saveAndClearLogConfig(type,action){
        let obj={},namedLoggerLevels={};
        obj.namedLoggerLevels={};
        if(action === 'clear'){
          obj.namedLoggerLevels[type] = {};
          obj.namedLoggerLevels[type].timeout = 0;
          obj.namedLoggerLevels[type].target_level = null;
        } else {
          obj.namedLoggerLevels[type] = this.logLevelObj[type];
        }
        obj.namedLoggerLevels[type].reset_level = 'INFO';
        delete obj.namedLoggerLevels[type].timeout_epoch;

        this.callLogConfigAPI(obj,null,action);
      },

      callLogConfigAPI(obj,addRow,action){
        const {topologyId,logConfig,logLevelObj} =  this;
        TopologyREST.postLogConfig(topologyId, {body : JSON.stringify(obj)}).then((result) => {
          if(result.responseMessage !== undefined){
            this.logLevelObj = logConfig;
            console.error(result.responseMessage);
          } else {
            let msg = !!addRow ? "Log configuration added successfully" : (action === 'save' ? "Log configuration applied successfully." : "Log configuration cleared successfully.");
            console.log(msg);
            this.fetchData();
          }
        });
      },

      addLoggerName(refType,action){
        if(action === 'save'){
          this.selectedKeyName = !!this.keyName ? this.keyName :  tempName;
        }
        this.refs[refType].hideEditor();
      },

      addLogRow(){
        const {selectedKeyName,selectedTrace,selectedTimeOut} = this;
        let obj={};
        obj.namedLoggerLevels = {};
        obj.namedLoggerLevels[selectedKeyName] = {};
        obj.namedLoggerLevels[selectedKeyName].target_level = selectedTrace;
        obj.namedLoggerLevels[selectedKeyName].reset_level = 'INFO';
        obj.namedLoggerLevels[selectedKeyName].timeout = selectedTimeOut;
        this.callLogConfigAPI(obj,'addRow');
      }

    }
  };
</script>
