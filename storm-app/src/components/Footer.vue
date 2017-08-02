<template>
  <p class="text-center">Apache Storm - {{stormVersion}}</p>
</template>
<script>
  import TopologyREST from '@/rest/TopologyREST';
  export default{
    data : function(){
      return {
        stormVersion : ''
      };
    },
    created : function(){
      TopologyREST.getSummary('cluster').then((res) => {
        this.stormVersion = res.stormVersion;
      });
    }
  };
</script>
