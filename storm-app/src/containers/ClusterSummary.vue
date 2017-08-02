<template>
  <div>
    <div class="row">
      <div class="col-sm-6">
        <div class="tile primary">
            <div class="tile-header">Executor</div>
            <div class="tile-body">
                <i class="fa fa-play-circle-o"></i>
                <span class="count">{{entity.executorsTotal || 0}}</span>
            </div>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="tile warning">
            <div class="tile-header">Tasks</div>
            <div class="tile-body">
                <i class="fa fa-tasks"></i>
                <span class="count">{{entity.tasksTotal || 0}}</span>
            </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6">
        <div class="tile success">
            <div class="tile-header text-center">Supervisor</div>
            <div class="tile-body text-center">
                <div id="supervisorCount">
                  Graph
                </div>
            </div>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="tile danger">
            <div class="tile-header text-center">Slots</div>
            <div class="tile-body text-center">
                <div id="slotsCount">
                  Graph
                </div>
            </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

  export default{
    name: 'ClusterSummary',
    entity : {},
    data() {
      this.entity = {};
      return this.entity;
    },
    created() {
      this.fetchData();
    },
    methods : {
      fetchData(){
        console.log('fetchData');
      }
    }
  };
</script>
