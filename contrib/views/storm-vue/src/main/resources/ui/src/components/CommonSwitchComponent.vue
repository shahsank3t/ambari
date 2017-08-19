<template>
  <div class="switchWrapper" :class="[!!KYC ? 'lagSwitchSetting pull-right' : '']">
    <span class="switchSlider" :class="[ checked ? 'onSlider' : 'offSlider']" @click.stop.prevent="switchClicked">
      <span class="switchItemOn sliderText" :class="[ !!KYC ? 'graphSwitchOn' : '']">{{on}}</span>
      <span class="switchItemMid"></span>
      <span class="switchItemOff sliderText" :class="[ !!KYC ? 'graphSwitchOff' : '']">{{off}}</span>
    </span>
  </div>
</template>
<script>
  import { EventBus } from '@/utils/EventBus';

  export default{
    name : "CommonSwitchComponent",
    props : ["KYC","checked","textON","textOFF","type","callBack"],
    data() {
      return{
        on : !!this.textON ? this.textON : "ON",
        off : !!this.textOFF ? this.textOFF : "OFF"
      };
    },
    methods : {
      switchClicked(){
        EventBus.$emit(this.callBack,this.type);
      }
    }
  };
</script>
