<template>
  <div>
    <app-Breadcrumbs :items="items"></app-Breadcrumbs>
    <app-SearchLogs :id="topologyId"></app-SearchLogs>
    <div class="row">
      <div class="col-sm-12">
        <div class="box filter">
          <div class="box-body form-horizontal">
            <app-CommonWindowPanel
              KYC="detailView"
              :toggleSystem="toggleSystem"
              :systemFlag="systemFlag"
              :debugFlag="debugFlag"
              :selectedWindowKey="selectedWindowKey"
              @handleWindowChange = "handleWindowChange"
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
      ref="debugConfirmBox"
      @resovle="handleConfirmResolve('debugConfirmBox')"
      @reject="handleConfirmReject('debugConfirmBox')"
      :confirmBox="true"
      closeLabel="cancel"
      >
      <div slot="mbody">
       Do you really want to stop debugging this topology ?
     </div>
    </app-FSModal>

    <!-- topology active deactivate confirmation box -->
    <app-FSModal
      ref="activateConfirmBox"
      @resovle="handleConfirmResolve('activateConfirmBox')"
      @reject="handleConfirmReject('activateConfirmBox')"
      :confirmBox="true"
      closeLabel="cancel"
      >
      <div slot="mbody">
       {{activeTopologyBoxContent}}
     </div>
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

  export default{
    name : "TopologyDetailView",
    components : {
      "app-Breadcrumbs" : Breadcrumbs,
      "app-SearchLogs" : SearchLogs,
      "app-CommonWindowPanel" : CommonWindowPanel,
      "app-FSModal" : FSModal,
      "app-RebalanceTopology" : RebalanceTopology,
      "app-LogLevelComponent" : LogLevelComponent
    },
    data(){
      return{
        topologyId : this.$route.params.topologyId,
        items : [],
        details: {},
        selectedWindowKey : null,
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
        showLogLevel : false
      };
    },
    created(){
      this.fetchDetails();
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
        const windowKeyVal = self.selectedWindowKey !== null ? self.selectedWindowKey.value : ':all-time' ;
        let promiseArr=[
          TopologyREST.getTopologyDetails(self.topologyId,windowKeyVal,self.systemFlag),
          TopologyREST.getTopologyGraphData(self.topologyId,windowKeyVal),
          TopologyREST.getTopologyLag(self.topologyId)
        ];

        Promise.all(promiseArr).then((results) => {
          _.map(results, (result) => {
            if(result.responseMessage !== undefined){
              console.error("Error in TopologyDetailView");
            }
          });

          self.details = results[0];
          self.items = this.getLinks();
          self.windowOptions = FilterUtils.populateWindowsOptions(self.details.topologyStats);
          self.debugSimplePCT = self.details.samplingPct;
          self.selectedWindowKey = {label : self.details.windowHint || 'All time', value : self.details.window || ':all-time'};
          self.graphData = results[1];
          self.topologyStatus = self.details !== undefined ? self.details.status : '';
          self.topologyLag = _.isEmpty(results[2]) ? [] : self.generateTopologyLagData(results[2]);
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
        } else {
          this.fetchDetails();
        }
      },

      // windows select2 change
      handleWindowChange(obj){
        console.log("Change",obj);
        console.log("Change",obj);
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
          this.debugFlag = true;
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
            console.error(result.responseMessage);
          } else {
            console.log("Debugging enabled successfully");
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
            console.error(result.responseMessage);
          } else {
            this.topologyStatus = result.status;
            console.log("Topology "+action+"d successfully.");
          }
        });
      },

      // topology kill handler
      handleTopologyKilled(){
        const {killWaitTime,details} = this;
        TopologyREST.postActionOnTopology(details.id,'kill',killWaitTime).then((result) => {
          if(result.responseMessage !== undefined){
            console.error(result.responseMessage);
          } else {
            clearTimeout(this.clearTimeOutKill);
            this.clearTimeOutKill =  setTimeout(function () {
              console.log("Topology killed successfully.");
            },300);
          }
        });
      },
      
      handleRebalanceModalSave(modalType){
        if(this.$refs.rebalanceModal.validateData()){
          this.$refs[modalType].hide();
          this.$refs.rebalanceModal.handleSave().then((result) => {
            if(result.responseMessage !== undefined){
              console.error(result.responseMessage);
            } else {
              this.fetchDetails();
              clearTimeout(this.clearTimeOut);
              this.clearTimeOut =  setTimeout(function () {
                console.log("Topology rebalanced successfully.");
              },300);
            }
          });
        }
      }



    }
  };
</script>
