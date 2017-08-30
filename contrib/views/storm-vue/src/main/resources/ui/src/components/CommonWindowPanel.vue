<template>
  <div class="form-group no-margin">
    <label class="col-sm-1 control-label">Window</label>
    <div class="col-sm-2">
      <app-select :options="windowOptions" :selectedVal="selectedWindowKey" :callBack="KYC !== 'detailView' ? 'componentWindowChange' : 'handleWindowChange'"/>
    </div>
    <label class="col-sm-2 control-label">System Summary</label>
    <div class="col-sm-2">
      <app-CommonSwitchComponent :checked="systemFlag" type="systemFlag" :callBack="systemAction" ></app-CommonSwitchComponent>
    </div>
    <label class="col-sm-1 control-label">Debug</label>
    <div class="col-sm-1">
      <app-CommonSwitchComponent :checked="debugFlag" type="debugFlag" :callBack="debugAction" ></app-CommonSwitchComponent>
    </div>
     <div class="col-sm-3 text-right">
      <div class="btn-group" role="group">

        <button  v-if="KYC === 'detailView'" type="button" class="btn btn-primary" @click="commonTopologyActionHandler('activate')" :disabled="topologyStatus === 'ACTIVE' ? 'disabled' : null">
          <i class="fa fa-play"></i>
        </button>
        <button  v-if="KYC === 'detailView'" type="button" class="btn btn-primary" @click="commonTopologyActionHandler('deactivate')"  :disabled="topologyStatus === 'INACTIVE' ? 'disabled' : null">
            <i class="fa fa-stop"></i>
          </button>
        <button  v-if="KYC === 'detailView'" type="button" class="btn btn-primary" @click="commonTopologyActionHandler('rebalance')" :disabled="topologyStatus === 'REBALANCING' ? 'disabled' : null">
            <i class="fa fa-balance-scale"></i>
          </button>
        <button  v-if="KYC === 'detailView'" type="button" class="btn btn-primary" @click="commonTopologyActionHandler('kill')" :disabled="topologyStatus === 'KILLED' ? 'disabled' : null">
            <i class="fa fa-ban"></i>
          </button>
        <button v-if="KYC === 'detailView'" type="button" class="btn btn-primary" @click="handleLogLevel">
            <i class="fa fa-file-o"></i>
        </button>
        <button v-if="KYC !== 'detailView'" type="button" class="btn btn-primary" @click="profilingClicked">
           <i class="fa fa-cogs"></i>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
  import CommonSwitchComponent from '@/components/CommonSwitchComponent';
  import VueSelect from '@/components/VueSelect';

  export default{
    name : "CommonWindowPanel",
    props : ["KYC","systemFlag","debugFlag","selectedWindowKey","windowOptions","topologyStatus","debugAction","systemAction"],
    components : {
      "app-CommonSwitchComponent" : CommonSwitchComponent,
      "app-select" : VueSelect
    },
    data(){
      return{
      };
    },
    methods:{
      commonTopologyActionHandler(type) {
        this.$emit("handleTopologyAction",type);
      },

      profilingClicked(){
        this.$emit("handleProfiling");
      },

      handleLogLevel(){
        this.$emit("handleLogLevel");
      }
    }
  };
</script>
