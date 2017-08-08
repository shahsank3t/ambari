<template>
  <transition name="modal">
    <div class="modal-mask" v-if=showModal>
      <div class="modal-wrapper">
        <div class="modal-container" :class="computedClass">
          <!-- Modal Header -->
          <div class="modal-header" v-if="hideHeader !== true">
            <h4>
              {{ getTitle }}
            </h4>
            <button class="close-btn pull-right" @click="reject"><i class="fa fa-times"></i></button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <slot name="mbody"></slot>
          </div>

          <!-- Modal footer -->
          <div class="modal-footer" v-if="hideFoot !== true">
            <button v-show="hideClose !== true" class="btn btn-default" @click="reject">
              {{getCloseTxt}}
            </button>
            <button v-show="hideOk !== true" class="btn btn-success" @click="resovle">
              {{getOkTxt}}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default{
    name : "FSModal",
    props : ["modalTitle","reference","okLabel","closeLabel",
      "hideOkBtn","hideCloseBtn","hideFooter","confirmBox","cssClass"],
    data(){
      return{
        showModal :false
      };
    },
    computed : {
      computedClass(){
        return this.cssClass ? this.cssClass : 'xm';
      },
      getTitle(){
        return this.modalTitle;
      },
      getOkTxt(){
        return this.okLabel ? this.okLabel :  "OK";
      },
      getCloseTxt(){
        return this.closeLabel ? this.closeLabel : "close";
      },
      hideClose(){
        return this.hideCloseBtn ? this.hideCloseBtn : false;
      },
      hideOk(){
        return this.hideOkBtn ? this.hideOkBtn : false;
      },
      hideFoot(){
        return this.hideFooter ? this.hideFooter : false;
      },
      hideHeader(){
        return this.confirmBox ? this.confirmBox : false;
      }
    },
    methods: {
      hide(){
        this.showModal = false;
      },
      show() {
        this.showModal = true;
      },
      resovle(){
        this.$emit("resovle");
      },
      reject(){
        this.$emit("reject");
      }
    }
  };
</script>
<style scope>
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 100%;
  margin: 0px auto;
  padding: 10px 3px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: inherit;
}

.modal-container.xl{width :90%}
.modal-container.lg{width : 70%}
.modal-container.sm{width : 50%}
.modal-container.xm{width : 40%}

.modal-header{
  position : relative !important;
}
h4 {
  justify-content: left;
  margin-top: 0;
  font-size: 18px;
}

.modal-body {
  margin: 20px 0;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.close-btn{
  position: absolute;
  right: 0;
  top:0;
  background: none;
  border: none;
  opacity: 0.5;
}
.close-btn:hover{
  opacity: 1;
}
</style>
