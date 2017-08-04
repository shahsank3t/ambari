<template>
  <div class="box-control pull-right box-custom">
    <span class="primary"><i :class="computedClassed"></i></span>
  </div>
</template>
<script>
  export default{
    name : "CommonExpanded",
    props : ["expandedProps"],
    data() {
      return {

      };
    },
    computed : {
      computedClassed(){
        return this.expandedProps ? 'fa fa-compress' : 'fa fa-expand';
      }
    }
  };
</script>
<style scope>
.box-custom{
  margin-left: 17px;
  margin-top: -2px;
}
</style>
