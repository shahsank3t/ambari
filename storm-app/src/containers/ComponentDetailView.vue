<template>
  <div>
    <app-Breadcrumbs :items="items"></app-Breadcrumbs>
    <app-SearchLogs :id="topologyId"></app-SearchLogs>
    <div class="row">
        <div class="col-sm-12">
          <div class="box filter">
            <div class="box-body form-horizontal">
              <app-CommonWindowPanel
                KYC="componentView"
                :selectedWindowKey="selectedWindowKey"
                :windowOptions="windowOptions"
                :systemFlag="systemFlag"
                :debugFlag="debugFlag"
                :handleWindowChange="handleWindowChange"
                :topologyStatus="topologyStatus"
                @handleProfiling="handleProfiling"/>
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
          <input class="form-control" type="number" :min="0" :max="Number.MAX_SAFE_INTEGER" :value="samplingPct" @input="inputTextChange('samplingPct',$event)"/>
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

  export default{
    name : "ComponentDetailView",
    props : [],
    components : {
      "app-Breadcrumbs" : Breadcrumbs,
      "app-SearchLogs" : SearchLogs,
      "app-FSModal" : FSModal,
      "app-CommonWindowPanel" : CommonWindowPanel
    },

    data(){
      return{
        topologyId : this.$route.params.id,
        items : [],
        selectedWindowKey : {label : 'All time' , value : ':all-time'},
        systemFlag : false,
        windowOptions :[],
        componentDetail: {},
        systemFlag : false,
        debugFlag : false,
        topologyStatus : '',
        samplingPct: ''
      };
    },

    created(){
      this.fetchDetails();
    },

    mounted(){
      EventBus.$on("switchCallBack", this.toggleSystem);
    },

    methods : {
      fetchDetails(){
        const {selectedWindowKey,systemFlag} = this;
        let self = this;
        TopologyREST.getTopologyComponentDetail(this.$route.params.topologyId, this.$route.params.componentName,selectedWindowKey.value,systemFlag).then((res) => {
          self.componentDetail = res;
          self.spoutFlag = self.componentDetail.componentType === 'spout' ? true: false;
          self.samplingPct = self.componentDetail.samplingPct;
          self.windowOptions = FilterUtils.populateWindowsOptions(self.spoutFlag ? self.componentDetail.spoutSummary : self.componentDetail.boltStats);
          if(self.windowOptions.length === 0){
            self.selectedWindowKey = '';
          }
          self.topologyStatus = self.componentDetail.topologyStatus;
          self.items = this.getLinks();
        });
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

      handleWindowChange(obj){
        if(!_.isEmpty(obj)){
          this.selectedWindowKey = obj;
          this.fetchDetails();
        }
      },

      handleProfiling(){
        console.log("ComponentDetailView");
        // this.refs.profileModelRef.show();
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
            console.error(result.responseMessage);
          } else {
            console.log("Debugging enabled successfully.");
          }
        });
      },

      // confirmbox modal resovle
      handleConfirmResolve(modal){
        if(modal === "debugConfirmBox"){
          this.debugFlag = false;
        }
        this.$refs[modal].hide();
      },

      // confirmBox modal reject
      handleConfirmReject(modal){
        if(modal === "debugConfirmBox"){
          this.debugFlag = !this.debugFlag;
        }
        this.$refs[modal].hide();
      }

    }
  };
</script>
