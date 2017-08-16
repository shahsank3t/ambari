<template>
  <div class="boxAnimated">
      <hr/>
      <h4 class="col-sm-offset-5">Change Log Level</h4>
      <p>Modify the logger levels for topology. Note that applying a setting restarts the timer in the workers. To configure the root logger, use the name ROOT.</p>
      <app-CommonTable
        classname='no-margin'
        :items="items"
        :fields="fields"
        :showPagination="showPagination"
        :tableHeaderData="tableHeaderData"
      >
        <template scope="{item}" slot="__logger__">
          <a v-if="!item.item.footer" href="javascript:void(0)">{{item.value}}</a>
          <app-Editable v-else
            ref="addRowRef"
            :inline="true"
            childType="input"
            :defaultValue="selectedKeyName"
            @callBack="handleNameChange"
            @resolve="addLoggerName('addRowRef','save')"
            @reject="addLoggerName('addRowRef','reject')"
          >
          </app-Editable>
        </template>

        <template scope="{item}" slot="__target_level__">
          <app-select :options="traceOption" :selectedVal="item.item.target_level" :loggerName="item.item.logger+'$%$'+item.index" callBack="handleLevelChange"/>
        </template>

        <template scope="{item}" slot="__timeout__">
          <app-Editable
            :ref="item.item.footer ? 'timeoutRef' : item.item.logger+'-'+item.index "
            :inline="true"
            childType="input"
            :defaultValue="item.item.footer ? selectedTimeOut : item.value "
            @callBack="handleTimeChange"
            @resolve="modifyCommonObjValue(item.item.footer ? 'timeoutRef' : item.item.logger+'-'+item.index,item.item.logger,'timeout','save', item.item.footer ? 'ADD' : null)"
            @reject="modifyCommonObjValue(item.item.footer ? 'timeoutRef' : item.item.logger+'-'+item.index,item.item.logger,'timeout','reject', item.item.footer ? 'ADD' : null)"
          >
          </app-Editable>
        </template>

        <template scope="{item}" slot="__timeout_epoch__">
          {{getDateFormat(item.value)}}
        </template>

        <template scope="{item}" slot="__action__">
          <span>
					  <a href="javascript:void(0)" class="btn btn-success btn-xs"
              @click="!item.item.footer ? saveAndClearLogConfig(item.item.logger,'save') : addLogRow('save') " >
              <i class="fa fa-check"></i>
            </a>&nbsp;
					  <a v-if="!item.item.footer"  href="javascript:void(0)" class="btn btn-danger btn-xs" @click="saveAndClearLogConfig(item.item.logger,'clear')"><i class="fa fa-times"></i></a>
					</span>
        </template>

      </app-CommonTable>
  </div>
</template>
<script>
  import TopologyREST from '@/rest/TopologyREST';
  import _ from 'lodash';
  import Editable from '@/components/Editable';
  import FilterUtils from '@/utils/FilterUtils';
  import CommonTable from '@/components/CommonTable';
  import VueSelect from '@/components/VueSelect';
  import {EventBus} from '@/utils/EventBus';

  export default{
    name : "LogLevelComponent",
    props :["topologyId"],
    components : {
      "app-Editable" : Editable,
      "app-CommonTable" : CommonTable,
      "app-select" : VueSelect
    },
    data(){
      let tableFields = this.getTableFields();
      return{
        logLevelObj : {},
        traceOption : this.populateTraceOptions(),
        selectedKeyName : 'com.your.organization.LoggerName',
        selectedTrace : 'ALL',
        selectedTimeOut : 30,
        keyName : '',
        timeChange : '',
        fields: tableFields,
        items: [],
        showPagination: false,
        tableHeaderData : [
          {fieldName: "logger", tooltip: "Logger", isCustom: true},
          {fieldName: "target_level", tooltip: "Level", isCustom: true},
          {fieldName: "timeout", tooltip: "Timeout", isCustom: true},
          {fieldName: "timeout_epoch", tooltip: "Expires At",  isCustom: true},
          {fieldName: "action", tooltip: "Action", isCustom: true}
        ]
      };
    },

    created(){
      this.fetchData();
    },

    mounted () {
      EventBus.$on("handleLevelChange", this.handleLevelChange);
    },

    methods : {
      getTableFields(){
        return {
          logger: {label: 'Logger'},
          target_level: {label: 'Level'},
          timeout: {label: 'Timeout'},
          timeout_epoch: {label: 'Expires At'},
          action: {label: 'Action'}
        };
      },

      fetchData(){
        TopologyREST.getLogConfig(this.topologyId).then((result) => {
          if(result.responseMessage !== undefined){
            console.error(result.responseMessage);
          } else {
            this.selectedKeyName = 'com.your.organization.LoggerName';
            this.selectedTrace = 'ALL';
            this.selectedTimeOut = 30;
            this.logLevelObj = result.namedLoggerLevels;
            this.items = this.objectToArray(result.namedLoggerLevels);
          }
        });
      },

      objectToArray(obj){
        const {selectedKeyName,selectedTrace,selectedTimeOut} = this;
        let arr=[];
        const keyList = _.keys(obj);
        _.map(keyList,(key,i) => {
          const o = Object.assign(obj[key],{logger : key});
          arr.push(o);
        });
        const t = {logger : selectedKeyName, reset_level : "DEBUG", target_level : selectedTrace, timeout : selectedTimeOut,footer : true};
        arr.push(t);
        return arr;
      },

      populateTraceOptions(){
        let temp=[];
        const arr = ['ALL','TRACE','DEBUG','INFO','WARN','ERROR','FATAL','OFF'];
        _.map(arr, (a) => {
          temp.push({text : a, value : a});
        });
        return temp;
      },

      handleNameChange(val){
        this.keyName =  val;
      },

      handleTimeChange(val){
        this.timeChange =  val;
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
        this.$refs[refType].hideEditor();
        this.timeChange = '';
      },

      getDateFormat(str){
        const d = new Date(str);
        return str !== undefined ? d.toLocaleDateString() + ' ' + d.toLocaleTimeString() : '';
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
        TopologyREST.postLogConfig(this.topologyId, {body : JSON.stringify(obj)}).then((result) => {
          if(result.responseMessage !== undefined){
            this.logLevelObj = this.logConfig;
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
          this.selectedKeyName = !!this.keyName ? this.keyName :  this.selectedKeyName;
        }
        this.$refs[refType].hideEditor();
      },

      addLogRow(){
        let obj={};
        obj.namedLoggerLevels = {};
        obj.namedLoggerLevels[this.selectedKeyName] = {};
        obj.namedLoggerLevels[this.selectedKeyName].target_level = this.selectedTrace;
        obj.namedLoggerLevels[this.selectedKeyName].reset_level = 'INFO';
        obj.namedLoggerLevels[this.selectedKeyName].timeout = this.selectedTimeOut;
        this.callLogConfigAPI(obj,'addRow');
      },

      handleLevelChange(obj,logger){
        if(!_.isEmpty(obj)){
          const log = logger.split('$%$');
          let addRow=null;
          let type = log[0];
          if(Number(log[1]) === (_.keys(this.logLevelObj).length)){
            addRow = 'ADD';
            type = null;
          }
          this.traceLavelChange(type,'target_level',addRow,obj);
        }
      }

    }
  };
</script>
