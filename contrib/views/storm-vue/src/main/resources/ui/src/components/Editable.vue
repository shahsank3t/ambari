<template>
  <div class="editable-container" :style="{display: 'inline'}" :id="id || ''">
    <a v-if="!edit && inline" ref="target" @click="handleClick" :style="anchorStyle">{{defaultValue}}</a>
    <div v-else="edit && inline">
      <input v-if="childType === 'input'"  class="form-control input-sm editInput" ref="focusInput" :value="defaultValue" @input="handleTimeChange"/>
      <button class="btn-primary btn-sm transparent-border" @click="handleResolve" key="resolve"  :style="{margin : '0 0 3px 5px'}">
          <i class="fa fa-check"></i>
      </button>
      <button class="btn-default btn-sm grey-border"  @click="handleReject" key="reject" :style="{margin : '0 3px'}">
        <i class="fa fa-times"></i>
      </button>
      <div class="editable-error">{{errorMsg}}</div>
    </div>
  </div>
</template>
<script>
  export default{
    name : "Editable",
    props : ["showButtons", "inline", "placement", "title","id","childType","defaultValue"],
    data(){
      return{
        edit: false,
        errorMsg: '',
        anchorStyle : {
          textDecoration: 'none',
          borderBottom: 'dashed 1px #0088cc',
          cursor: 'pointer',
          color: '#323133'
        }
      };
    },
    methods : {
      handleClick(){
        this.edit = true;
      },

      handleResolve(){
        this.$emit("resolve");
      },

      handleReject(){
        const {reject} = this;
        if (reject) {
          this.$emit("reject");
        } else {
          this.hideEditor();
        }
      },

      hideEditor(){
        this.edit = false;
      },

      getValueString() {
        const {child} = this;

        if (child.tag == 'input' || child.tag == 'textarea') {
          return child.data.domProps.value || child.data.domProps.defaultValue;
        } else if (child.type == 'select') {} else {
          var fn = child.getStringValue;
          if (fn) {
            return fn();
          } else {
            console.error('Custom component must have getValueString() function.');
          }
        }
      },

      handleTimeChange(event){
        this.$emit("callBack",event.target.value.trim());
      }
    }
  };
</script>
<style scoped>
.transparent-border{
  border: 1px solid transparent;
}

.grey-border{
  border:1px solid #ccc;
}
</style>
