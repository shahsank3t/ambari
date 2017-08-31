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
      <div class="btn-group btn-inline" role="group">
        <b-popover v-if="KYC === 'detailView'"  triggers="hover" placement="top" content="activate">
          <button  type="button" class="btn btn-primary" @click="commonTopologyActionHandler('activate')" :disabled="topologyStatus === 'ACTIVE' ? 'disabled' : null">
            <i class="fa fa-play"></i>
          </button>
        </b-popover>
        <b-popover v-if="KYC === 'detailView'" triggers="hover" placement="top" content="deactivate">
          <button  type="button" class="btn btn-primary" @click="commonTopologyActionHandler('deactivate')"  :disabled="topologyStatus === 'INACTIVE' ? 'disabled' : null">
            <i class="fa fa-stop"></i>
          </button>
        </b-popover>
        <b-popover v-if="KYC === 'detailView'" triggers="hover" placement="top" content="rebalance">
          <button  type="button" class="btn btn-primary" @click="commonTopologyActionHandler('rebalance')" :disabled="topologyStatus === 'REBALANCING' ? 'disabled' : null">
            <i class="fa fa-balance-scale"></i>
          </button>
        </b-popover>
        <b-popover v-if="KYC === 'detailView'" triggers="hover" placement="top" content="kill">
          <button  type="button" class="btn btn-primary" @click="commonTopologyActionHandler('kill')" :disabled="topologyStatus === 'KILLED' ? 'disabled' : null">
            <i class="fa fa-ban"></i>
          </button>
        </b-popover>
        <b-popover v-if="KYC === 'detailView'" triggers="hover" placement="top" content="Change Log Levels">
          <button  type="button" class="btn btn-primary" @click="handleLogLevel">
              <i class="fa fa-file-o"></i>
          </button>
        </b-popover>
        <b-popover v-if="KYC !== 'detailView'" triggers="hover" placement="top" content="Profiling & Debugging">
          <button type="button" class="btn btn-primary" @click="profilingClicked" :style="{'border-bottom-right-radius' : '4px !important','border-top-right-radius' : '4px !important'}">
             <i class="fa fa-cogs"></i>
          </button>
        </b-popover>
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
<style scoped>
.btn-inline > div {
  float: left;
  clear: right;
}
.btn-inline > div:not(:first-child) > span > button,
.btn-inline > div:not(:last-child) > span > button{
  border-radius: 0;
}
.btn-inline > div:last-child > span > button{
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
}
.btn-inline > div:first-child > span > button{
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 4px;
  border-top-left-radius: 4px;
}
</style>
