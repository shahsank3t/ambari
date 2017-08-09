<template>
  <div>
    <div class="form-group row">
      <div class="col-sm-3">
        <label>Workers:<span class="text-danger">*</span></label>
      </div>
      <div class="col-sm-7">
        <span :style="{float : 'left'}">0</span>
        <input type="range" :title="rebalanceData.workers +' workers selected.'" :min="0" :style="{width : '90%', float : 'left',margin : '6px 7px'}" :max="totalWorker" @input="rebalanceValueChange('workers',$event)" />
        <span :style="{float : 'left', clear : 'right'}">{{totalWorker}}</span>
      </div>
    </div>
    <div class="form-group row" v-for="spout in spoutArr" :key="spout.spoutId">
      <div class="col-sm-3">
        <label>{{spout.spoutId}}:<span class="text-danger">*</span></label>
      </div>
      <div class="col-sm-7">
        <input type="number" class="form-control" :min="0" :value="spout.executors" @input="rebalanceValueChange(spout.spoutId,$event)" />
      </div>
    </div>
    <div class="form-group row" v-for="bolt in boltArr" :key="bolt.boltId">
      <div class="col-sm-3">
        <label>{{bolt.boltId}}:<span class="text-danger">*</span></label>
      </div>
      <div class="col-sm-7">
        <input type="number" class="form-control" :min="0" :value="bolt.executors" @input="rebalanceValueChange(bolt.boltId,$event)" />
      </div>
    </div>

    <div class="form-group row">
      <div class="col-sm-3">
        <label>Wait Time:<span class="text-danger">*</span></label>
      </div>
      <div class="col-sm-7">
        <input type="number" class="form-control" :min="0" :value="waitTime" @input="waitTimeChange($event)" />
      </div>
    </div>
  </div>
</template>
<script>
  import TopologyREST from '@/rest/TopologyREST';
  import _ from 'lodash';

  export default{
    name : "REBALANCING",
    props : ["topologyId","spoutArr","boltArr","topologyExecutors"],
    data(){
      return{
        freeSlot : 0,
        waitTime : 30,
        rebalanceData : {},
        totalWorker : 0
      };
    },
    created(){
      this.fetchData();
    },
    methods : {
      fetchData(){
        const {topologyExecutors,spoutArr,boltArr} = this;
        let self = this;
        TopologyREST.getSummary('cluster').then((result) => {
          if(result.responseMessage !== undefined){
            console.error(result.responseMessage);
          } else {
            self.freeSlot = result.slotsFree;
            self.rebalanceData={};
            self.rebalanceData.workers = topologyExecutors + self.freeSlot;
            self.totalWorker = self.rebalanceData.workers;
            _.map(spoutArr, (s) => {
              self.rebalanceData[s.spoutId] = s.executors;
            });
            _.map(boltArr, (b) => {
              self.rebalanceData[b.boltId] = b.executors;
            });
          }
        });
      },

      rebalanceValueChange(type,event){
        this.rebalanceData[type] = +event.target.value;
      },

      waitTimeChange(event){
        this.waitTime = +event.target.value;
      },

      validateData(){
        const {rebalanceData,waitTime} = this;
        let errorFlag = [];
        _.map(_.keys(rebalanceData), (key) => {
          if(rebalanceData[key] === ''){
            errorFlag.push(false);
          }
        });
        if(waitTime === ''){
          errorFlag.push(false);
        }
        return errorFlag.length ? false : true;
      },

      handleSave(){
        const {rebalanceData,waitTime,topologyId} = this;
        let finalData = {
          "rebalanceOptions": {
            "executors": {}
          }
        };
        _.map(_.keys(rebalanceData), (key) => {
          if(key === "workers"){
            finalData.rebalanceOptions.numWorkers = rebalanceData[key];
          } else {
            finalData.rebalanceOptions.executors[key] = rebalanceData[key];
          }
        });

        return TopologyREST.postActionOnTopology(topologyId,'rebalance',waitTime,{body : JSON.stringify(finalData)});
      }



    }
  };
</script>
