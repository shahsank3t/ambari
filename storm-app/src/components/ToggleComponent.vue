<template>
  <div class="panel">
    <b-btn block v-b-toggle="'computedCaption'" class="toggleBtn" variant="default" @click="expanded = !expanded">
      <h4 class="text-left">{{computedCaption}}
        <toggleComponent-CommonExpanded :expandedProps="expanded"></toggleComponent-CommonExpanded>
        <CommonSwitchComponent
          v-if="lag"
          KYC="kafka"
          type="kafkaLag"
          :checked="toggle"
          textON="Table"
          textOFF="Graph"
          callBack="kafkaLagSwitch">
        </CommonSwitchComponent>
      </h4>
    </b-btn>
    <b-collapse :id="computedCaption"  :visible="expanded"  :accordion="computedCaption">
      <b-card>
        <slot></slot>
      </b-card>
    </b-collapse>
  </div>
</template>

<script>
  import CommonExpanded from '@/components/CommonExpanded';
  import CommonSwitchComponent from '@/components/CommonSwitchComponent';

  export default{
    name: 'ToggleComponent',
    props:["caption","lag","toggle","kafkaLag","default"],
    data(){
      return{
        expanded : this.default || false
      };
    },
    computed : {
      computedCaption(){
        return this.caption || '';
      }
    },
    methods : {},
    components : {
      "toggleComponent-CommonExpanded" : CommonExpanded,
      "CommonSwitchComponent" : CommonSwitchComponent
    }
  };
</script>

<style scope>

.toggleBtn{
  background-color: #f3f6f9;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom-width: 0;
  padding: 10px 15px;
}

.toggleBtn:focus,
.toggleBtn:active,
.toggleBtn:active:focus{
  outline: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-color: #ccc;
}

.toggleBtn > h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  color: inherit;
}
.panel{
  margin-bottom: 20px;
  border-bottom: 1px #ccc solid;
  border-bottom-width: 3px;
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
  box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
  border-radius: 5px;
}
.toggleBtn:hover,
.toggleBtn:active,
.toggleBtn:focus{
  background-color: #f3f6f9 !important;
}
.card{
  border-color: #ccc;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
}

</style>
