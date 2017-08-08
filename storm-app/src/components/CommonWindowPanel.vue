<template>
  <div class="form-group no-margin">
    <label class="col-sm-1 control-label">Window</label>
    <div class="col-sm-2">
      <!-- <Select value={selectedWindowKey} options={windowOptions} onChange={this.windowChange.bind(this)} valueKey="label" labelKey="label" clearable={false}/> -->
    </div>
    <label class="col-sm-2 control-label">System Summary</label>
    <div class="col-sm-2">
      <app-CommonSwitchComponent :checked="systemFlag" @switchCallBack="toggleSystem('systemFlag')"></app-CommonSwitchComponent>
      <!-- <CommonSwitchComponent checked={systemFlag} switchCallBack={this.commonToggleChange.bind(this,'systemFlag')}/> -->
    </div>
    <label class="col-sm-1 control-label">Debug</label>
    <div class="col-sm-1">
      <app-CommonSwitchComponent :checked="debugFlag" @switchCallBack="toggleSystem('debugFlag')"></app-CommonSwitchComponent>
      <!-- <CommonSwitchComponent checked={debugFlag} switchCallBack={this.commonToggleChange.bind(this,'debugFlag')}/> -->
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
        <button v-if="KYC !== 'detailView'" type="button" class="btn btn-primary" @click={handleProfiling}>
           <i class="fa fa-cogs"></i>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
  import CommonSwitchComponent from '@/components/CommonSwitchComponent';

  export default{
    name : "CommonWindowPanel",
    props : ["KYC","systemFlag","debugFlag","selectedWindowKey","windowOptions","toggleSystem","topologyStatus"],
    components : {
      "app-CommonSwitchComponent" : CommonSwitchComponent
    },
    data(){
      return{
      };
    },
    computed : {

    },
    methods:{
      windowChange(val){
        console.log("trigger");
      },
      commonTopologyActionHandler(type) {
        this.$emit("handleTopologyAction",type);
      },
      handleProfiling(){
        console.log("handleProfiling");
      },
      handleLogLevel(){
        this.$emit("handleLogLevel");
      }
    }
  };
</script>
