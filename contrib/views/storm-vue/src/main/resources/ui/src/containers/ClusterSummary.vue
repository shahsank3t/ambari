<template>
  <div>
    <template v-if="fetchLoader">
      <div :style="{height : fetchLoader ? '200px' : 'auto'}">
        <div class="loading-img text-center">
          <img src="static/img/start-loader.gif" alt="loading" :style="{width : '50px'}"/>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="row">
        <div class="col-sm-6">
          <b-popover triggers="hover" placement="bottom" content="Executors are threads in a Worker process.">
            <div class="tile primary">
                <div class="tile-header">Executor</div>
                <div class="tile-body">
                    <i class="fa fa-play-circle-o"></i>
                    <span class="count">{{entity.executorsTotal || 0}}</span>
                </div>
            </div>
          </b-popover>
        </div>
        <div class="col-sm-6">
          <b-popover triggers="hover" placement="bottom" content="A Task is an instance of a Bolt or Spout. The number of Tasks is almost always equal to the number of Executors.">
            <div class="tile warning">
                <div class="tile-header">Tasks</div>
                <div class="tile-body">
                    <i class="fa fa-tasks"></i>
                    <span class="count">{{entity.tasksTotal || 0}}</span>
                </div>
            </div>
          </b-popover>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-6">
          <b-popover triggers="hover" placement="bottom" content="The number of nodes in the cluster currently.">
            <div class="tile success">
                <div class="tile-header text-center">Supervisor</div>
                <div class="tile-body text-center">
                    <div id="supervisorCount">
                      <app-clustersummary-radial :graphData="supervisorsData" :labels="labels" :width="width" :height="height"
                        :innerRadius="innerRadius" :outerRadius="outerRadius" :color="color"></app-clustersummary-radial>
                    </div>
                </div>
            </div>
          </b-popover>
        </div>
        <div class="col-sm-6">
          <b-popover triggers="hover" placement="bottom" content="Slots are Workers (processes).">
            <div class="tile danger">
                <div class="tile-header text-center">Slots</div>
                <div class="tile-body text-center">
                    <div id="slotsCount">
                      <app-clustersummary-radial :graphData="slotsUsedData" :labels="labels" :width="width" :height="height"
                        :innerRadius="innerRadius" :outerRadius="outerRadius" :color="color"></app-clustersummary-radial>
                    </div>
                </div>
            </div>
          </b-popover>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <app-nimbusSummary :fromDashboard="true"></app-nimbusSummary>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import TopologyREST from '@/rest/TopologyREST';
  import RadialChart from '@/components/RadialChart';
  import NimbusSummary from './NimbusSummary';
  import FSToaster from '@/utils/FSToaster';

  export default{
    name: 'ClusterSummary',
    data : () => {
      return{
        entity : {},
        supervisorsData : [],
        slotsUsedData : [],
        labels : ['Used','Total'],
        width : 100,
        height : 100,
        innerRadius :46,
        outerRadius : 50,
        color : ["rgba(255,255,255,0.6)", "rgba(255,255,255,1)"],
        fetchLoader : true
      };
    },
    created() {
      this.fetchData();
    },
    methods : {
      fetchData(){
        TopologyREST.getSummary('cluster').then((result) => {
          if(result.responseMessage !== undefined){
            FSToaster.error("Error in ClusterSummary");
          } else {
            this.entity = result;
            this.supervisorsData = [this.entity.supervisors,this.entity.supervisors];
            this.slotsUsedData = [this.entity.slotsUsed,this.entity.slotsTotal];
            this.fetchLoader = false;
          }
        });
      }
    },
    components : {
      'app-clustersummary-radial' : RadialChart,
      'app-nimbusSummary': NimbusSummary
    }
  };
</script>
