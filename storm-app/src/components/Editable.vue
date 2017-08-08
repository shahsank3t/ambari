<template>
  <div>
    Editable Components
  </div>
</template>
<script>
  export default{
    name : "Editable",
    data(){
      return{
        edit: false,
        errorMsg: ''
      };
    },
    methods : {
      handleClick(){
        this.edit = true;
      },

      handleResolve(){
        const {resolve} = this;
        if (resolve) {
          resolve(this);
        }
      },

      handleReject(){
        const {reject} = this;
        if (reject) {
          reject(this);
        } else {
          this.hideEditor();
        }
      },

      hideEditor(){
        this.edit = false;
      },

      getValueString() {
        const {$children} = this;

        if ($children.type == 'input' || $children.type == 'textarea') {
          return $children.props.value || $children.props.defaultValue;
        } else if ($children.type == 'select') {} else {
          var fn = $children.getStringValue;
          if (fn) {
            return fn();
          } else {
            console.error('Custom component must have getValueString() function.');
          }
        }
      }
    }
  };
</script>
