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
              KYC="detailView"
              :systemFlag="systemFlag"
              :debugFlag="debugFlag"
              :selectedWindowKey="selectedWindowKey"
              :windowOptions="windowOptions"
              :topologyStatus="topologyStatus"
              @handleTopologyAction="handleTopologyAction"
              @handleLogLevel="handleLogLevel"
            ></app-CommonWindowPanel>
            <app-LogLevelComponent v-if="showLogLevel" :topologyId="details.id"></app-LogLevelComponent>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-5">
        <div class="summary-tile">
          <div class="summary-title">Topology Summary</div>
          <div class="summary-body form-horizontal">
            <div class="form-group">
              <label class="col-sm-4 control-label">ID:</label>
              <div class="col-sm-8">
                <p class="form-control-static">{{details.id}}</p>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label">Owner:</label>
              <div class="col-sm-8">
                <p class="form-control-static">{{details.owner}}</p>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label">Status:</label>
              <div class="col-sm-8">
                <p class="form-control-static">{{details.status}}</p>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label">Uptime:</label>
              <div class="col-sm-8">
                <p class="form-control-static">{{details.uptime}}</p>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label">Workers:</label>
              <div class="col-sm-8">
                <p class="form-control-static">{{details.workersTotal}}</p>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label">Executors:</label>
              <div class="col-sm-8">
                <p class="form-control-static">{{details.executorsTotal}}</p>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label">Tasks:</label>
              <div class="col-sm-8">
                <p class="form-control-static">{{details.tasksTotal}}</p>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label">Memory:</label>
              <div class="col-sm-8">
                <p class="form-control-static">{{details.assignedTotalMem}}</p>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label">Worker-Host:Port:</label>
              <div class="col-sm-8">
                <p class="form-control-static preformatted">{{getWorkerData()}}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="col-sm-7">
        <div class="stats-tile">
          <div class="stats-title">Topology Stats</div>
          <div class="stats-body">
            <app-CommonTable
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

    <app-ToggleComponent :caption="details.name" type="topologyGraph" :default="true">
      <div class="box-body">
        <app-TopologyGraph :graphData="graphData"></app-TopologyGraph>
      </div>
    </app-ToggleComponent>

    <app-ToggleComponent caption="Kafka Spout Lag"
      :lag="true"
      type="kafkaLag"
      :toggle="toggleGraphAndTable"
      :default="true">
      <div class="box-body">
        <app-CommonTable
          v-if="toggleGraphAndTable"
          classname="table-striped table-bordered"
          :items="topologyLag"
          :fields="topologyLagFields"
          :showPagination="false"
          :tableHeaderData="topLagHeaderData"
        >
      </app-CommonTable>
        <div v-else id="lag-graph">
          <app-BarChart
            ref="barChart"
            :width="screenWidth"
            :height="400"
            xAttr="spoutId-partition"
            yAttr="count"
            :data="barChartData"
            >
          </app-BarChart>
        </div>
      </div>
    </app-ToggleComponent>

    <app-ToggleComponent caption="Spouts" :default="true">
      <div class="box-body">
        <div class="input-group col-sm-4">
          <input @input="filterChanged('spoutItems','constSpoutItems','spoutId', $event)" class="form-control" type="text" placeholder="Search By Topology Name" />
          <span class="input-group-btn">
            <button class="btn btn-primary" type="button"><i class="fa fa-search"></i></button>
          </span>
        </div>
        <app-CommonTable
          classname='no-margin'
          :items="spoutItems"
          :fields="spoutFields"
          :showPagination="true"
          :tableHeaderData="spoutHeaderData"
          :parentId = "topologyId"
          >

          <template scope="{item}" slot="__spoutId__">
            <router-link :to="{name: 'ComponentDetail', params: {topologyId: topologyId, componentName : item.value}}">{{item.value}}</router-link>
          </template>

        </app-CommonTable>
      </div>
    </app-ToggleComponent>

    <app-ToggleComponent caption="Bolts" :default="true">
      <div class="box-body">
        <div class="input-group col-sm-4">
          <input @input="filterChanged('blotsItems','constBoltsItems','boltId', $event)" class="form-control" type="text" placeholder="Search By Topology Name" />
          <span class="input-group-btn">
            <button class="btn btn-primary" type="button"><i class="fa fa-search"></i></button>
          </span>
        </div>

        <app-CommonTable
          classname='no-margin'
          :items="blotsItems"
          :fields="boltsFields"
          :showPagination="true"
          :tableHeaderData="boltsHeaderData"
          :parentId = "topologyId"
          >

          <template scope="{item}" slot="__boltId__">
            <router-link :to="{name: 'ComponentDetail', params: {topologyId: topologyId, componentName : item.value}}">{{item.value}}</router-link>
          </template>

        </app-CommonTable>
      </div>
    </app-ToggleComponent>


    <app-ToggleComponent caption="Topology Configuration">
      <div class="box-body">
        <div class="input-group col-sm-4">
          <input @input="filterChanged('configItems','constConfigItems','Key', $event)" class="form-control" type="text" placeholder="Search By Topology Name" />
          <span class="input-group-btn">
            <button class="btn btn-primary" type="button"><i class="fa fa-search"></i></button>
          </span>
        </div>

        <app-CommonTable
          classname='no-margin'
          :items="configItems"
          :fields="configFields"
          :showPagination="true"
          :tableHeaderData="configHeaderData"
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
        <input class="form-control" type="number" :min="0" :max="Number.MAX_SAFE_INTEGER" :value="debugSimplePCT" @input="inputTextChange('debugSimplePCT',$event)"/>
      </div>
    </app-FSModal>

    <!--  REBALANCING Modal -->
    <app-FSModal
      modalTitle="Rebalance Topology"
      cssClass="sm"
      ref="rebalanceModelRef"
      @resovle="handleModelAction('rebalanceModelRef','save')"
      @reject="handleModelAction('rebalanceModelRef','cancel')"
      >
      <div slot="mbody">
        <app-RebalanceTopology
          ref="rebalanceModal"
          :topologyId="details.id"
          :spoutArr="details.spouts"
          :boltArr="details.bolts"
          :topologyExecutors="details.workersTotal"
          >
        </app-rebalanceTopology>
     </div>
    </app-FSModal>

    <!-- Kill topology modal -->
    <app-FSModal
      modalTitle="Are you sure you want to kill this topology ? If yes, please, specify wait time in seconds."
      cssClass="sm"
      ref="killModelRef"
      @resovle="handleConfirmResolve('killModelRef')"
      @reject="handleConfirmReject('killModelRef')"
      >
      <div slot="mbody">
        <input class="form-control" type="number" :min="0" :max="Number.MAX_SAFE_INTEGER" :value="killWaitTime" @input="inputTextChange('killWaitTime',$event)"/>
     </div>
    </app-FSModal>

    <!-- debug confirmation box -->
    <app-FSModal
      modalTitle="Do you really want to stop debugging this topology ?"
      cssClass="sm"
      ref="debugConfirmBox"
      @resovle="handleConfirmResolve('debugConfirmBox')"
      @reject="handleConfirmReject('debugConfirmBox')"
      :confirmBox="true"
      closeLabel="Cancel"
      >
    </app-FSModal>

    <!-- topology active deactivate confirmation box -->
    <app-FSModal
      :modalTitle="activeTopologyBoxContent"
      cssClass="sm"
      ref="activateConfirmBox"
      @resovle="handleConfirmResolve('activateConfirmBox')"
      @reject="handleConfirmReject('activateConfirmBox')"
      :confirmBox="true"
      closeLabel="Cancel"
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
  import RebalanceTopology from '@/components/RebalanceTopology';
  import LogLevelComponent from '@/components/LogLevelComponent';
  import CommonTable from '@/components/CommonTable';
  import ToggleComponent from '@/components/ToggleComponent';
  import BarChart from '@/components/BarChart';
  import TopologyGraph from '@/components/TopologyGraph';
  import {EventBus} from '@/utils/EventBus';
  import FSToaster from '@/utils/FSToaster';

  export default{
    name : "TopologyDetailView",
    components : {
      "app-Breadcrumbs" : Breadcrumbs,
      "app-SearchLogs" : SearchLogs,
      "app-CommonWindowPanel" : CommonWindowPanel,
      "app-FSModal" : FSModal,
      "app-RebalanceTopology" : RebalanceTopology,
      "app-LogLevelComponent" : LogLevelComponent,
      "app-CommonTable" : CommonTable,
      "app-ToggleComponent" : ToggleComponent,
      "app-BarChart" : BarChart,
      "app-TopologyGraph": TopologyGraph
    },
    data(){
      return{
        topologyId : this.$route.params.topologyId,
        items : [],
        details: {},
        selectedWindowKey : {},
        windowOptions : [],
        systemFlag : false,
        debugFlag : false,
        killWaitTime : 30,
        topologyLag : [],
        debugSimplePCT:'',
        graphData:[],
        topologyStatus : '',
        activeTopologyBoxContent : '',
        topologyAction : '',
        showLogLevel : false,
        topStateItem : [],
        filter : null,
        topStateFields : this.getStateTableFields(),
        topStateHeaderData : this.getTopStateHeaderData(),
        topologyLagFields : this.getTopologyLagFields(),
        topLagHeaderData : this.getTopologyLagHeaderData(),
        toggleGraphAndTable : true,
        spoutItems : [],
        constSpoutItems :[],
        spoutFields : this.getSpoutFields(),
        spoutHeaderData : this.getSpoutHeaderData(),
        blotsItems : [],
        constBoltsItems:[],
        boltsFields : this.getBoltsFields(),
        boltsHeaderData : this.getBoltesHeaderData(),
        configItems : [],
        constConfigItems : [],
        configFields : this.getConfigFields(),
        configHeaderData : this.getConfigHeaderData(),
        screenWidth : window != window.parent ? 1100 : 1300,
        barChartData :[]
      };
    },
    created(){
      this.fetchDetails();
    },

    mounted () {
      EventBus.$on("systemSwitch", this.toggleSystem);
      EventBus.$on("debugSwitch", this.toggleSystem);
      EventBus.$on("kafkaLagSwitch", this.toggleSystem);
      EventBus.$on("handleWindowChange", this.handleWindowChange);
    },

    methods:{
      // populate link for breadcrumbs
      getLinks(){
        const links = [
          {link: '#/', title: 'Dashboard'},
          {link: '#/topology', title: 'Topology Listing'},
          {link: 'javascript:void(0);', title: this.details ? this.details.name : ""}
        ];
        return links;
      },

      // fetch initial data
      fetchDetails(){
        let self = this;
        const windowKeyVal = !_.isEmpty(self.selectedWindowKey) ? self.selectedWindowKey.value : ':all-time' ;
        let promiseArr=[
          TopologyREST.getTopologyDetails(self.topologyId,windowKeyVal,self.systemFlag),
          TopologyREST.getTopologyGraphData(self.topologyId,windowKeyVal),
          TopologyREST.getTopologyLag(self.topologyId)
        ];

        Promise.all(promiseArr).then((results) => {
          _.map(results, (result) => {
            if(result.responseMessage !== undefined){
              FSToaster.error(result.responseMessage);
            }
          });

          self.details = results[0];
          self.items = this.getLinks();
          self.windowOptions = FilterUtils.populateWindowsOptions(self.details.topologyStats);
          if(this.windowOptions.length === 0){
            this.selectedWindowKey = {};
          }
          self.debugSimplePCT = self.details.samplingPct;
          self.selectedWindowKey = {text : self.details.windowHint || 'All time', value : self.details.window || ':all-time'};
          self.graphData = results[1];
          self.topologyStatus = self.details !== undefined ? self.details.status : '';
          self.topologyLag = _.isEmpty(results[2]) ? [] : self.generateTopologyLagData(results[2]);
          self.topStateItem = self.details.topologyStats;
          self.spoutItems = self.details.spouts;
          self.constSpoutItems = self.details.spouts;
          self.blotsItems = self.details.bolts;
          self.constBoltsItems = self.details.bolts;
          self.configItems = this.dataTransformation(self.details.configuration);
          self.constConfigItems = this.dataTransformation(self.details.configuration);
          self.barChartData = this.populateLagGraphData(self.topologyLag);
        });
      },

      // data for topologyLag
      generateTopologyLagData(lagObj){
        const objKey = _.keys(lagObj);
        let arr = [];
        _.map(objKey, (o) => {
          let data = lagObj[o];
          const topicKeys = _.keys(data.spoutLagResult);
          _.map(topicKeys, (t) => {
            const topicName = t;
            const partitionData = data.spoutLagResult[t];
            const partitionKey = _.keys(partitionData);
            _.map(partitionKey, (pk) => {
              let obj = partitionData[pk];
              obj['spoutId'] = data.spoutId;
              obj['spoutType'] = data.spoutType;
              obj['partition'] = pk;
              obj['topic'] = topicName;
              arr.push(obj);
            });
          });
        });
        return arr;
      },

      // toggle for systemFlag and debugFlag
      toggleSystem(toggleStatus){
        this[toggleStatus] = !this[toggleStatus];
        if(toggleStatus === 'debugFlag'){
          !this.debugFlag ? this.debugEnableConfirmBox(this.debugFlag,'debugConfirmBox') : this.$refs.debugModelRef.show();
        } else if ( toggleStatus ==="kafkaLag"){
          this.toggleGraphAndTable = !this.toggleGraphAndTable;
        } else {
          this.fetchDetails();
        }
      },

      // windows select2 change
      handleWindowChange(obj){
        if(!_.isEmpty(obj)){
          this.selectedWindowKey = obj;
          this.fetchDetails();
        }
      },

      // Log levels
      handleLogLevel(){
        this.showLogLevel = !this.showLogLevel;
      },

      // All Modal action handler
      handleModelAction(modalType,action){
        if(action === 'save'){
          switch(modalType){
          case 'debugModelRef' : this.handleDebugSave(modalType,'enable');;
            break;
          case 'rebalanceModelRef' : this.handleRebalanceModalSave(modalType);
            break;
          case 'killModelRef' : this.handleTopologyKilled(modalType);
            break;
          default :
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

      // debug inputTextChange handler
      inputTextChange(type,event){
        this[type] = +event.target.value;
      },

      debugEnableConfirmBox(confirm,modalType){
        if(!confirm){
          this.$refs[modalType].show();
        }
      },

      // confirmbox modal resovle
      handleConfirmResolve(modal){
        if(modal === "debugConfirmBox"){
          this.debugFlag = false;
          FSToaster.success("Debugging disabled successfully");
        } else if(modal === "killModelRef"){
          this.handleTopologyKilled();
        } else if (modal === "activateConfirmBox"){
          this.handleTopologyActiveAndDeactive(this.topologyAction);
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

      // handle debug change
      handleDebugSave(modal,toEnableFlag){
        const {debugSimplePCT,details} = this;
        this.$refs[modal].hide();
        TopologyREST.postDebugTopology(details.id,toEnableFlag,debugSimplePCT).then((result) => {
          if(result.responseMessage !== undefined){
            this.debugSimplePCT = details.samplingPct;
            FSToaster.error(result.responseMessage);
          } else {
            FSToaster.success("Debugging enabled successfully");
          }
        });
      },

      // Topology action handler
      handleTopologyAction(action){
        this.topologyAction = action;
        if(action === 'activate' || action === 'deactivate'){
          this.activeTopologyBoxContent = "Do you really want to "+action+" this topology ?";
          this.$refs.activateConfirmBox.show();
        } else if(action === 'rebalance'){
          this.$refs.rebalanceModelRef.show();
        } else if (action === "kill"){
          this.$refs.killModelRef.show();
        }
      },

      // topology active and deactive callback
      handleTopologyActiveAndDeactive(action){
        const {details} = this;
        TopologyREST.postActionOnTopology(details.id,action).then((result) => {
          if(result.responseMessage !== undefined){
            FSToaster.error(result.responseMessage);
          } else {
            this.topologyStatus = result.status;
            FSToaster.success("Topology "+action+"d successfully.");
          }
        });
      },

      // topology kill handler
      handleTopologyKilled(){
        const {killWaitTime,details} = this;
        TopologyREST.postActionOnTopology(details.id,'kill',killWaitTime).then((result) => {
          if(result.responseMessage !== undefined){
            FSToaster.error(result.responseMessage);
          } else {
            clearTimeout(this.clearTimeOutKill);
            this.clearTimeOutKill =  setTimeout(function () {
              FSToaster.success("Topology killed successfully.");
            },300);
          }
        });
      },

      handleRebalanceModalSave(modalType){
        if(this.$refs.rebalanceModal.validateData()){
          this.$refs[modalType].hide();
          this.$refs.rebalanceModal.handleSave().then((result) => {
            if(result.responseMessage !== undefined){
              FSToaster.error(result.responseMessage);
            } else {
              this.fetchDetails();
              clearTimeout(this.clearTimeOut);
              this.clearTimeOut =  setTimeout(function () {
                FSToaster.success("Topology rebalanced successfully.");
              },300);
            }
          });
        }
      },

      getWorkerData(){
        const {details} = this;
        let data='';
        _.map(details.workers,(worker,i) => {
          data += worker.host+':'+worker.port;
          if(i !== details.workers.length - 1){
            data += ', \n';
          }
        });
        return data;
      },

      getStateTableFields(){
        return {
          windowPretty: {label: 'Window'},
          emitted: {label: 'Emitted'},
          transferred: {label: 'Transferred'},
          completeLatency: {label: 'Complete Latency (ms)'},
          acked: {label: 'Acked'},
          failed: {label: 'Failed'}
        };
      },

      getTopStateHeaderData(){
        return [
          {fieldName : "windowPretty" , tooltip : "The past period of time for which the statistics apply."},
          {fieldName : "emitted" , tooltip : "The number of Tuples emitted." },
          {fieldName : "transferred" , tooltip : "The number of Tuples emitted that sent to one or more bolts." },
          {fieldName : "completeLatency" , tooltip : "The average time a Tuple tree takes to be completely processed by the Topology. A value of 0 is expected if no acking is done." },
          {fieldName : "acked" , tooltip : "The number of Tuple trees successfully processed. A value of 0 is expected if no acking is done." },
          {fieldName : "failed" , tooltip : "The number of Tuple trees that were explicitly failed or timed out before acking was completed. A value of 0 is expected if no acking is done." }
        ];
      },

      getTopologyLagHeaderData(){
        return [
          {fieldName : "spoutId" , tooltip : "Id"},
          {fieldName : "topic" , tooltip : "Topic"},
          {fieldName : "partition" , tooltip : "Partition"},
          {fieldName : "logHeadOffset" , tooltip : "Latest Offset"},
          {fieldName : "consumerCommittedOffset" , tooltip : "Spout Committed Offset"},
          {fieldName : "lag" , tooltip : "Lag"}
        ];
      },

      getTopologyLagFields(){
        return {
          spoutId: {label: 'Id'},
          topic: {label: 'Topic'},
          partition: {label: 'Partition'},
          logHeadOffset: {label: 'Latest Offset'},
          consumerCommittedOffset: {label: 'Spout Committed Offset'},
          lag: {label: 'Lag'}
        };
      },

      getSpoutHeaderData(){
        return [
          {fieldName : "spoutId" , tooltip : "The ID assigned to a the Component by the Topology. Click on the name to view the Component's page.", isCustom :true},
          {fieldName : "executors" , tooltip : "Executors are threads in a Worker process."},
          {fieldName : "tasks" , tooltip : "A Task is an instance of a Bolt or Spout. The number of Tasks is almost always equal to the number of Executors."},
          {fieldName : "emitted" , tooltip : "The number of Tuples emitted."},
          {fieldName : "transferred" , tooltip : "The number of Tuples emitted that sent to one or more bolts."},
          {fieldName : "completeLatency" , tooltip : "The average time a Tuple tree takes to be completely processed by the Topology. A value of 0 is expected if no acking is done."},
          {fieldName : "acked" , tooltip : "The number of Tuple trees successfully processed. A value of 0 is expected if no acking is done."},
          {fieldName : "failed" , tooltip : "The number of Tuple trees that were explicitly failed or timed out before acking was completed. A value of 0 is expected if no acking is done."},
          {fieldName : "errorHost" , tooltip : "Error Host:Port"},
          {fieldName : "lastError" , tooltip : "Last Error"},
          {fieldName : "errorTime" , tooltip : "Error Time"}
        ];
      },

      getSpoutFields(){
        return{
          spoutId : {label : "Id"},
          executors : {label : "Executors"},
          tasks : {label : "Tasks"},
          emitted : {label : "Emitted"},
          transferred : {label : "Transferred"},
          completeLatency : {label : "Complete Latency (ms)"},
          acked : {label : "Acked"},
          failed : {label : "Failed"},
          errorHost : {label : "Error Host:Port"},
          lastError : {label : "Last Error"},
          errorTime : {label : "Error Time"}
        };
      },

      getBoltsFields(){
        return {
          boltId : {label : "Id"},
          executors : {label : "Executors"},
          tasks : {label : "Tasks"},
          emitted : {label : "Emitted"},
          transferred : {label : "Transferred"},
          capacity : {label : "Capacity (last 10m)"},
          executeLatency : {label : "Execute Latency (ms)"},
          executed : {label : "Executed"},
          processLatency : {label : "Process Latency (ms)"},
          acked : {label : "Acked"},
          failed : {label : "Failed"},
          errorHost : {label : "Error Host:Port"},
          lastError : {label : "Last Error"},
          errorTime : {label : "Error Time"}
        };
      },

      getBoltesHeaderData(){
        return [
          {fieldName : "boltId" , tooltip : "The ID assigned to a the Component by the Topology. Click on the name to view the Component's page.", isCustom : true},
          {fieldName : "executors" , tooltip : "Executors are threads in a Worker process."},
          {fieldName : "tasks" , tooltip : "A Task is an instance of a Bolt or Spout. The number of Tasks is almost always equal to the number of Executors."},
          {fieldName : "emitted" , tooltip : "The number of Tuples emitted."},
          {fieldName : "transferred" , tooltip : "The number of Tuples emitted that sent to one or more bolts."},
          {fieldName : "capacity" , tooltip : "If this is around 1.0, the corresponding Bolt is running as fast as it can, so you may want to increase the Bolt's parallelism. This is (number executed * average execute latency) / measurement time."},
          {fieldName : "executeLatency" , tooltip : "The average time a Tuple spends in the execute method. The execute method may complete without sending an Ack for the tuple."},
          {fieldName : "executed" , tooltip : "The number of incoming Tuples processed."},
          {fieldName : "processLatency" , tooltip : "The average time it takes to Ack a Tuple after it is first received.  Bolts that join, aggregate or batch may not Ack a tuple until a number of other Tuples have been received."},
          {fieldName : "acked" , tooltip : "The number of Tuples acknowledged by this Bolt."},
          {fieldName : "failed" , tooltip : "The number of tuples Failed by this Bolt."},
          {fieldName : "errorHost" , tooltip : "Error Host:Port"},
          {fieldName : "lastError" , tooltip : "Last Error"},
          {fieldName : "errorTime" , tooltip : "Error Time"}
        ];
      },

      getConfigFields(){
        return{
          Key : {label : "Key"},
          value : {label : "Value"}
        };
      },

      getConfigHeaderData(){
        return[
          {fieldName : "Key"},
          {fieldName : "value"}
        ];
      },

      // toggleTableAndGraphFUNC(){
      //   this.toggleGraphAndTable = !this.toggleGraphAndTable;
      // },

      dataTransformation(obj){
        let arr = [];
        const list = _.keys(obj);
        _.map(list, (l) => {
          arr.push({Key : l, value : obj[l]});
        });
        return arr;
      },

      //Filter by topology name
      filterChanged(typeVal, fixTypeVal, key ,event){
        const filterStr = event.target.value.trim();
        this[typeVal] = FilterUtils.filterByKey(this[fixTypeVal], filterStr,key);
      },

      populateLagGraphData(){
        let graphArr=[];
        _.map(this.topologyLag, (t) => {
          graphArr.push({
            'Latest Offset': t.logHeadOffset,
            'Spout Committed Offset': t.consumerCommittedOffset,
            'spoutId-partition': t.spoutId+'-'+t.partition
          });
        });
        return graphArr;
      }
    }
  };
</script>
