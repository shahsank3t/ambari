<template>
  <div class="switchWrapper" :class="[!!KYC ? 'lagSwitchSetting pull-right' : '']">
    <span class="switchSlider" :class="[ checked ? 'onSlider' : 'offSlider']" @click="switchCallBack">
      <span class="switchItemOn sliderText" :class="[ !!KYC ? 'graphSwitchOn' : '']">{{on}}</span>
      <span class="switchItemMid"></span>
      <span class="switchItemOff sliderText" :class="[ !!KYC ? 'graphSwitchOff' : '']">{{off}}</span>
    </span>
  </div>
</template>
<script>
  export default{
    name : "CommonSwitchComponent",
    props : ["KYC","checked","textON","textOFF"],
    data() {
      return{
        on : !!this.textON ? this.textON : "ON",
        off : !!this.textOFF ? this.textOFF : "OFF"
      };
    },
    methods : {
      switchCallBack(){
        this.$emit('switchCallBack');
      }
    }
  };
</script>
