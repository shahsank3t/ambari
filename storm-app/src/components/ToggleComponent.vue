<template>
  <div class="paddingBottom">
    <b-btn block v-b-toggle variant="default" @click="expanded = !expanded">
      <h4 class="text-left">{{computedCaption}}
        <toggleComponent-CommonExpanded :expandedProps="expanded"></toggleComponent-CommonExpanded>
        <CommonSwitchComponent
          v-if="lag"
          KYC="kafka"
          type="kafkaLag"
          :checked="toggle"
          textON="Table"
          textOFF="Graph">
        </CommonSwitchComponent>
      </h4>
    </b-btn>
    <transition name="bounce">
      <b-collapse class="custom" :id="computedCaption" :visible="expanded"  :accordion="computedCaption">
        <b-card>
          <slot></slot>
        </b-card>
      </b-collapse>
    </transition>
  </div>
</template>

<script>
  import CommonExpanded from '@/components/CommonExpanded';
  import CommonSwitchComponent from '@/components/CommonSwitchComponent';

  export default{
    name: 'ToggleComponent',
    props:["caption","lag","toggle","kafkaLag"],
    data(){
      return{
        expanded : false
      };
    },
    computed : {
      computedCaption(){
        return this.caption;
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
h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1px;
}
.paddingBottom{
  padding-bottom: 20px;
}
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
