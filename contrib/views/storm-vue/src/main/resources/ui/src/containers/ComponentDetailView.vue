<template>
  <div>
    <div class="row">
      <div class="col-sm-12">
        <app-Breadcrumbs :items="items"></app-Breadcrumbs>
        <app-SearchLogs :id="topologyId"></app-SearchLogs>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <div class="box filter">
          <div class="box-body form-horizontal">
            <app-CommonWindowPanel
              KYC="componentView"
              debugAction="debugCallBack"
              systemAction="systemCallBack"
              :selectedWindowKey="selectedWindowKey"
              :windowOptions="windowOptions"
              :systemFlag="systemFlag"
              :debugFlag="debugFlag"
              :topologyStatus="topologyStatus"
              @handleProfiling="handleProfiling"/>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-4">
        <div class="summary-tile">
          <div class="summary-title">Component Summary</div>
          <div class="summary-body" :style="{height : fetchLoader ? '100px' : 'auto'}">
            <template v-if="fetchLoader">
              <div class="loading-img text-center">
                <img src="static/img/start-loader.gif" alt="loading" :style="{width : '50px'}"/>
              </div>
            </template>
            <template v-else>
              <p><strong>ID: </strong>{{componentDetail.id}}</p>
              <p><strong>Topology: </strong>{{componentDetail.name}}</p>
              <p><strong>Executors: </strong>{{componentDetail.executors}}</p>
              <p><strong>Tasks: </strong>{{componentDetail.tasks}}</p>
              <p><strong>Debug: </strong><a :href="componentDetail.eventLogLink" target="_blank">events</a></p>
            </template>
          </div>
        </div>
      </div>
      <div class="col-sm-8">
        <div class="stats-tile">
          <div class="stats-title">{{computedState}}</div>
          <div class="stats-body" :style="{height : fetchLoader ? '100px' : 'auto'}">
            <template v-if="fetchLoader">
              <div class="loading-img text-center">
                <img src="static/img/start-loader.gif" alt="loading" :style="{width : '50px'}"/>
              </div>
            </template>
            <app-CommonTable
              v-else
              classname='no-margin'
              :items="topStateItem"
              :fields="topStateFields"
              :showPagination="false"
              popoverPosition="top"
              :tableHeaderData="topStateHeaderData"
              >
            </app-CommonTable>
          </div>
        </div>
      </div>
    </div>

    <app-ToggleComponent v-if="componentDetail.inputStats" :caption="'Input Stats ('+componentDetail.windowHint+')'" :default="true" :fetchLoader="fetchLoader">
      <div class="padding-sm">
        <div class="input-group col-sm-4">
          <input @input="filterChanged('inputItems','constInputItems','component', $event)" class="form-control" type="text" placeholder="Search By Topology Name" />
          <span class="input-group-btn">
            <button class="btn btn-primary" type="button"><i class="fa fa-search"></i></button>
          </span>
        </div>
        <app-CommonTable
          classname='no-margin'
          :items="inputItems"
          :fields="inputFields"
          :showPagination="true"
          :tableHeaderData="inputHeaderData"
          >
        </app-CommonTable>
      </div>
    </app-ToggleComponent>

    <app-ToggleComponent v-if="componentDetail.outputStats" :caption="'Output Stats ('+componentDetail.windowHint+')'" :default="true" :fetchLoader="fetchLoader">
      <div class="padding-sm">
        <div class="input-group col-sm-4">
          <input @input="filterChanged('outputItems','constOutputItems','stream', $event)" class="form-control" type="text" placeholder="Search By Topology Name" />
          <span class="input-group-btn">
            <button class="btn btn-primary" type="button"><i class="fa fa-search"></i></button>
          </span>
        </div>
        <app-CommonTable
          classname='no-margin'
          :items="outputItems"
          :fields="outputFields"
          :showPagination="true"
          :tableHeaderData="outputHeaderData"
          >
        </app-CommonTable>
      </div>
    </app-ToggleComponent>

    <app-ToggleComponent v-if="componentDetail.executorStats" :caption="'Executor Stats ('+componentDetail.windowHint+')'" :default="true" :fetchLoader="fetchLoader">
      <div class="padding-sm">
        <div class="input-group col-sm-4">
          <input @input="filterChanged('executorItems','constExecutorItems','id', $event)" class="form-control" type="text" placeholder="Search By Topology Name" />
          <span class="input-group-btn">
            <button class="btn btn-primary" type="button"><i class="fa fa-search"></i></button>
          </span>
        </div>
        <app-CommonTable
          classname='no-margin'
          :items="executorItems"
          :fields="executorFields"
          :showPagination="true"
          :tableHeaderData="executorHeaderData"
          >

          <template scope="{item}" slot="__port__">
            <a :href="item.item.workerLogLink" target="_blank">{{item.item.host}} : {{item.item.port}}</a>
          </template>

          <template scope="{item}" slot="__workerLogLink__">
            <a :href="item.item.workerLogLink.split('/log')[0]+'/dumps/'+componentDetail.topologyId+'/'+item.item.host+':'+item.item.port" target="_blank" class="btn btn-primary btn-xs"><i class="fa fa-file-text"></i></a>
          </template>

        </app-CommonTable>
      </div>
    </app-ToggleComponent>

    <app-ToggleComponent v-if="componentDetail.componentErrors" :caption="'Error Stats ('+componentDetail.windowHint+')'" :default="true" :fetchLoader="fetchLoader">
      <div class="padding-sm">
        <div class="input-group col-sm-4">
          <input @input="filterChanged('errorItems','constErrorItems','errorTime', $event)" class="form-control" type="text" placeholder="Search By Topology Name" />
          <span class="input-group-btn">
            <button class="btn btn-primary" type="button"><i class="fa fa-search"></i></button>
          </span>
        </div>
        <app-CommonTable
          classname='no-margin'
          :items="errorItems"
          :fields="errorFields"
          :showPagination="true"
          :tableHeaderData="errorHeaderData"
          >

        </app-CommonTable>
      </div>
    </app-ToggleComponent>



      <!-- debug modal  -->
      <app-FSModal
        modalTitle="Do you really want to debug this topology ? If yes, please, specify sampling percentage."
        cssClass="sm"
        ref="debugModelRef"
        @resovle="handleModelAction('debugModelRef','save')"
        @reject="handleModelAction('debugModelRef','cancel')"
        >
        <div slot="mbody">
          <input class="form-control" type="number" :min="0" :max="Number.MAX_SAFE_INTEGER" :value="samplingPct" @input="inputTextChange('samplingPct',$event)"/>
        </div>
      </app-FSModal>

      <app-FSModal
        modalTitle="Profiling & Debugging"
        cssClass="sm"
        ref="profileModelRef"
        :hideOkBtn="true"
        @reject="handleModelAction('profileModelRef','cancel')"
        >
        <div slot="mbody">
          <app-ProfilingView
            :topologyId="componentDetail.topologyId"
            :executorStats="componentDetail.executorStats">
          </app-ProfilingView>
        </div>
      </app-FSModal>

      <!-- debug confirmation box -->
      <app-FSModal
        modalTitle="Do you really want to stop debugging this topology ?"
        ref="debugConfirmBox"
        @resovle="handleConfirmResolve('debugConfirmBox')"
        @reject="handleConfirmReject('debugConfirmBox')"
        :confirmBox="true"
        closeLabel="cancel"
        >
      </app-FSModal>

  </div>
</template>
<script>
  import Breadcrumbs from '@/components/Breadcrumbs';
  import FilterUtils from '@/utils/FilterUtils';
  import TopologyREST from '@/rest/TopologyREST';
  import _ from 'lodash';
  import SearchLogs from '@/components/SearchLogs';
  import CommonWindowPanel from '@/components/CommonWindowPanel';
  import FSModal from '@/components/FSModal';
  import {EventBus} from '@/utils/EventBus';
  import ProfilingView from '@/components/ProfilingView';
  import ToggleComponent from '@/components/ToggleComponent';
  import CommonTable from '@/components/CommonTable';
  import FSToaster from '@/utils/FSToaster';

  export default{
    name : "ComponentDetailView",
    props : [],
    components : {
      "app-Breadcrumbs" : Breadcrumbs,
      "app-SearchLogs" : SearchLogs,
      "app-FSModal" : FSModal,
      "app-CommonWindowPanel" : CommonWindowPanel,
      "app-ProfilingView" : ProfilingView,
      "app-ToggleComponent" : ToggleComponent,
      "app-CommonTable" : CommonTable
    },

    data(){
      return{
        topologyId : this.$route.params.id,
        items : [],
        selectedWindowKey : {text : 'All time' , value : ':all-time'},
        systemFlag : false,
        windowOptions :[],
        componentDetail: {},
        systemFlag : false,
        debugFlag : false,
        topologyStatus : '',
        samplingPct: '',
        topStateItem : [],
        topStateFields : {},
        topStateHeaderData : [],
        inputItems :[],
        inputFields : {},
        inputHeaderData : [],
        constInputItems : [],
        outputItems : [],
        outputFields : {},
        outputHeaderData : [],
        constOutputItems :[],
        executorItems : [],
        executorFields : {},
        executorHeaderData : [],
        constExecutorItems :[],
        errorItems : [],
        errorFields : {},
        errorHeaderData : [],
        constErrorItems :[],
        fetchLoader : true
      };
    },

    created(){
      this.fetchDetails();
    },

    mounted(){
      EventBus.$on("debugCallBack", this.toggleSystem);
      EventBus.$on("systemCallBack", this.toggleSystem);
      EventBus.$on("componentWindowChange", this.componentWindowChange);
    },

    computed : {
      computedState(){
        return this.spoutFlag ? "Spout Stats" : "Bolt Stats";
      }
    },

    methods : {
      fetchDetails(){
        const {selectedWindowKey,systemFlag} = this;
        TopologyREST.getTopologyComponentDetail(this.$route.params.topologyId, this.$route.params.componentName,selectedWindowKey.value,systemFlag).then((res) => {
          this.componentDetail = res;
        });
      },

      populateComponentData(){
        this.spoutFlag = this.componentDetail.componentType === 'spout' ? true: false;
        this.samplingPct = this.componentDetail.samplingPct;
        this.debugFlag = this.componentDetail.debug;
        this.windowOptions = FilterUtils.populateWindowsOptions(this.spoutFlag ? this.componentDetail.spoutSummary : this.componentDetail.boltStats);
        if(this.windowOptions.length === 0){
          this.selectedWindowKey = {};
        }
        this.selectedWindowKey = {text : this.componentDetail.windowHint || 'All time', value : this.componentDetail.window || ':all-time'};
        this.topologyStatus = this.componentDetail.topologyStatus;
        this.items = this.getLinks();
        this.topStateItem = this.componentDetail.spoutSummary || this.componentDetail.boltStats;
        this.topStateFields = this.getTopStateFields();
        this.topStateHeaderData = this.getTopStateHeaderData();
        this.inputItems = this.componentDetail.inputStats;
        // constInputItems dulpicate array for filter usage
        this.constInputItems = this.componentDetail.inputStats;
        this.inputFields = this.getInputFields();
        this.inputHeaderData = this.getInputHeaderData();
        this.outputItems = this.componentDetail.outputStats;
        // constOutputItems dulpicate array for filter usage
        this.constOutputItems = this.componentDetail.outputStats;
        this.outputFields = this.getOutputFields();
        this.outputHeaderData = this.getOutputHeaderData();
        this.executorItems = this.componentDetail.executorStats;
        // constExecutorItems dulpicate array for filter usage
        this.constExecutorItems = this.componentDetail.executorStats;
        this.executorFields  = this.getExecutorFields();
        this.executorHeaderData = this.getExecutorHeaderData();
        this.errorItems = this.componentDetail.componentErrors;
        // constErrorItems dulpicate array for filter usage
        this.constErrorItems = this.componentDetail.componentErrors;
        this.errorFields = this.getErrorFields();
        this.errorHeaderData = this.getErrorHeaderData();
        this.fetchLoader = false;
      },

      getLinks(){
        const {componentDetail} = this;
        var links = [
          {link: '#/', title: 'Dashboard'},
          {link: '#/topology', title: 'Topology Listing'},
          {link: '#/topology/'+componentDetail.topologyId, title: componentDetail.name || ""},
          {link: 'javascript:void(0);', title: componentDetail.id || ""}
        ];
        return links;
      },

      componentWindowChange(obj){
        if(!_.isEmpty(obj)){
          this.selectedWindowKey = obj;
          this.fetchDetails();
        }
      },

      handleProfiling(){
        this.$refs.profileModelRef.show();
      },

      toggleSystem(toggleStatus){
        this[toggleStatus] = !this[toggleStatus];
        if(toggleStatus === 'debugFlag'){
          !this.debugFlag ? this.debugEnableConfirmBox(this.debugFlag,'debugConfirmBox') : this.$refs.debugModelRef.show();
        } else {
          this.fetchDetails();
        }
      },

      debugEnableConfirmBox(confirm,modalType){
        if(!confirm){
          this.$refs[modalType].show();
        }
      },

      handleModelAction(modalType,action){
        if(action === 'save'){
          switch(modalType){
          case 'debugModelRef' : this.handleDebugSave(modalType,'enable');
            break;
          default : this.$refs[modalType].hide();
            break;
          }
        } else{
          switch(modalType){
          case 'debugModelRef' : this.debugFlag = !this.debugFlag;
            break;
          default :
            break;
          }
          this.$refs[modalType].hide();
        }
      },

      handleDebugSave(modal,toEnableFlag) {
        const {samplingPct,componentDetail} = this;
        this.$refs[modal].hide();
        const componentID = componentDetail.topologyId+'/component/'+componentDetail.id;
        TopologyREST.postDebugTopology(componentID,toEnableFlag,samplingPct).then((result) => {
          if(result.responseMessage !== undefined){
            this.samplingPct = componentDetail.samplingPct;
            FSToaster.error(result.responseMessage);
          } else {
            FSToaster.success("Debugging enabled successfully.");
          }
        });
      },

      // confirmbox modal resovle
      handleConfirmResolve(modal){
        if(modal === "debugConfirmBox"){
          this.debugFlag = false;
          FSToaster.success("Debugging disabled successfully");
        }
        this.$refs[modal].hide();
      },

      // confirmBox modal reject
      handleConfirmReject(modal){
        if(modal === "debugConfirmBox"){
          this.debugFlag = !this.debugFlag;
        }
        this.$refs[modal].hide();
      },

      getTopStateFields(){
        return this.spoutFlag  ? {
          windowPretty : {label : "Window"},
          emitted : {label : "Emitted"},
          transferred : {label : "Transferred"},
          completeLatency : {label : "Complete Latency (ms)"},
          acked : {label : "Acked"},
          failed : {label : "Failed"}
        }
        : {
          windowPretty : {label : "Window"},
          emitted : {label : "Emitted"},
          transferred : {label : "Transferred"},
          executeLatency : {label : "Execute Latency (ms)"},
          executed : {label : "Executed"},
          processLatency : {label : "Process Latency (ms)"},
          acked : {label : "Acked"},
          failed : {label : "Failed"}
        };
      },

      getTopStateHeaderData(){
        const {spoutFlag} = this;
        let arr = [
          {fieldName : "windowPretty", tooltip : "The past period of time for which the statistics apply."},
          {fieldName : "emitted", tooltip : "The number of Tuples emitted."},
          {fieldName : "transferred", tooltip : "The number of Tuples emitted that sent to one or more bolts."},
          {fieldName : "completeLatency", tooltip : "The average time a Tuple 'tree' takes to be completely processed by the Topology. A value of 0 is expected if no acking is done."},
          {fieldName : "acked", tooltip : spoutFlag ? 'The number of Tuple "trees" successfully processed. A value of 0 is expected if no acking is done.' : "The number of Tuples acknowledged by this Bolt."},
          {fieldName : "failed", tooltip : spoutFlag ? 'The number of Tuple "trees" that were explicitly failed or timed out before acking was completed. A value of 0 is expected if no acking is done.' : "The number of tuples Failed by this Bolt."}
        ];
        let t =[];
        if(!spoutFlag){
          t = arr.splice(0,4);
          t.length = 3;
          const sFields = [
            {fieldName : "executeLatency" , tooltip : "The average time a Tuple spends in the execute method. The execute method may complete without sending an Ack for the tuple."},
            {fieldName : "executed" , tooltip : "The number of incoming Tuples processed."},
            {fieldName : "processLatency" , tooltip : "The average time it takes to Ack a Tuple after it is first received.  Bolts that join, aggregate or batch may not Ack a tuple until a number of other Tuples have been received."}
          ];
          Array.prototype.push.apply(t,sFields);
          Array.prototype.push.apply(t,arr);
        }
        return spoutFlag ?  arr : t;
      },

      getInputFields(){
        return{
          component : {label : "Component"},
          stream : {label : "Stream"},
          executeLatency : {label : "Execute Latency (ms)"},
          executed : {label : "Executed"},
          processLatency : {label : "Process Latency (ms)"},
          acked : {label : "Acked"},
          failed : {label : "Failed"}
        };
      },

      getInputHeaderData(){
        return [
          {fieldName : "component", tooltip : "The ID assigned to a the Component by the Topology."},
          {fieldName : "stream", tooltip : "The name of the Tuple stream given in the Topolgy, or &#34;default&#34; if none was given."},
          {fieldName : "executeLatency", tooltip : "The average time a Tuple spends in the execute method. The execute method may complete without sending an Ack for the tuple."},
          {fieldName : "executed", tooltip : "The number of incoming Tuples processed."},
          {fieldName : "processLatency", tooltip : "The average time it takes to Ack a Tuple after it is first received.  Bolts that join, aggregate or batch may not Ack a tuple until a number of other Tuples have been received."},
          {fieldName : "acked", tooltip : "The number of Tuples acknowledged by this Bolt."},
          {fieldName : "failed", tooltip : "The number of tuples Failed by this Bolt."}
        ];
      },

      getOutputFields(){
        return this.spoutFlag
        ? {
          stream : {label : "Stream"},
          emitted : {label : "Emitted"},
          transferred : {label : "Transferred"},
          completeLatency : {label : "Complete Latency (ms)"},
          acked : {label : "Acked"},
          failed : {label : "Failed"}
        }
        : {
          stream : {label : "Stream"},
          emitted : {label : "Emitted"},
          transferred : {label : "Transferred"}
        };

      },

      getOutputHeaderData(){
        const {spoutFlag} = this;
        let arr = [
          {fieldName : "stream", tooltip : "The name of the Tuple stream given in the Topolgy, or &#34;default&#34; if none was given."},
          {fieldName : "emitted", tooltip : "The number of Tuples emitted."},
          {fieldName : "transferred", tooltip : "The number of Tuples emitted that sent to one or more bolts."},
          {fieldName : "completeLatency", tooltip : "The average time a Tuple &#34;tree&#34; takes to be completely processed by the Topology. A value of 0 is expected if no acking is done."},
          {fieldName : "acked", tooltip : "The number of Tuple &#34;trees&#34; successfully processed. A value of 0 is expected if no acking is done."},
          {fieldName : "failed", tooltip : "The number of Tuple &#34;trees&#34; that were explicitly failed or timed out before acking was completed. A value of 0 is expected if no acking is done."}
        ];
        let t =[];
        if(!spoutFlag){
          t = arr.splice(3,3);
        }
        return arr;
      },

      getExecutorFields(){
        return this.spoutFlag
          ? {
            id : { label : "Id"},
            uptime : { label : "Uptime"},
            port : { label : "Host:Port"},
            emitted : { label : "Emitted"},
            transferred : { label : "Transferred"},
            completeLatency : { label : "Complete Latency (ms)"},
            acked : { label : "Acked"},
            failed : { label : "Failed"},
            workerLogLink : { label : "Dumps"}
          }
          : {
            id : { label : "Id"},
            uptime : { label : "Uptime"},
            port : { label : "Host:Port"},
            emitted : { label : "Emitted"},
            transferred : { label : "Transferred"},
            capacity : { label : "Capacity (last 10m)"},
            executeLatency : { label : "Execute Latency (ms)"},
            executed : { label : "Executed"},
            processLatency : { label : "Process Latency (ms)"},
            acked : { label : "Acked"},
            failed : { label : "Failed"},
            workerLogLink : { label : "Dumps"}
          };
      },

      getExecutorHeaderData(){
        const {spoutFlag} = this;
        let arr = [
          {fieldName : "id", tooltip : "The unique executor ID."},
          {fieldName : "uptime", tooltip : "The length of time an Executor (thread) has been alive."},
          {fieldName : "port", tooltip : "The hostname reported by the remote host. (Note that this hostname is not the result of a reverse lookup at the Nimbus node.) Click on it to open the logviewer page for this Worker.", isCustom :true},
          {fieldName : "emitted", tooltip : "The number of Tuples emitted."},
          {fieldName : "transferred", tooltip : "The number of Tuples emitted that sent to one or more bolts."},
          {fieldName : "completeLatency", tooltip : "The average time a Tuple &#34;tree&#34; takes to be completely processed by the Topology. A value of 0 is expected if no acking is done."},
          {fieldName : "acked", tooltip : "The number of Tuple &#34;trees&#34; successfully processed. A value of 0 is expected if no acking is done."},
          {fieldName : "failed", tooltip : "The number of Tuple &#34;trees&#34; that were explicitly failed or timed out before acking was completed. A value of 0 is expected if no acking is done."},
          {fieldName : "workerLogLink", tooltip : "Dumps", isCustom :true}
        ];
        let t= [];
        if(!spoutFlag){
          t = arr.splice(0,5);
          const sFields = [
            {fieldName : "capacity", tooltip : "If this is around 1.0, the corresponding Bolt is running as fast as it can, so you may want to increase the Bolt's parallelism. This is (number executed * average execute latency) / measurement time."},
            {fieldName : "executeLatency", tooltip : "The average time a Tuple spends in the execute method. The execute method may complete without sending an Ack for the tuple."},
            {fieldName : "executed", tooltip : "The number of incoming Tuples processed."},
            {fieldName : "processLatency", tooltip : "The average time it takes to Ack a Tuple after it is first received.  Bolts that join, aggregate or batch may not Ack a tuple until a number of other Tuples have been received."}
          ];
          Array.prototype.push.apply(t,sFields);
          Array.prototype.push.apply(t,arr);
        }
        return spoutFlag ?  arr : t;
      },

      getErrorFields(){
        return {
          errorTime : {label : "Time"},
          errorPort : {label : "Host:Port"},
          error : {label : "Error"}
        };
      },

      getErrorHeaderData(){
        return [
          {fieldName : "errorTime", tooltip : "Time"},
          {fieldName : "errorPort", tooltip : "Host:Port"},
          {fieldName : "error", tooltip : "Error"}
        ];
      },

      //Filter by topology name
      filterChanged(typeVal, fixTypeVal, key ,event){
        const filterStr = event.target.value.trim();
        this[typeVal] = FilterUtils.filterByKey(this[fixTypeVal], filterStr,key);
      }

    },
    watch : {
      componentDetail : function(){
        this.populateComponentData();
      }
    }
  };
</script>
