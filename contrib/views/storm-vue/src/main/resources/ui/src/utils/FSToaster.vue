<script>
    import Vue from 'vue';
    let FSToaster = new Vue({
      methods:{
        success(text,opt){
          this.defaultNofity('success',text,opt);
        },
        info(text,opt){
          this.defaultNofity('info' ,text,opt);
        },
        warning(text,opt){
          this.defaultNofity('warning' ,text,opt);
        },
        error(text,opt){
          this.defaultNofity('error' ,text,opt);
        },
        defaultNofity(type,text,opt){
          let textHtml = !!text ? "<h5><i class='fa fa-check'></i> "+text+"</h5>" : '';
          const obj = Object.assign({type,text:textHtml},opt);
          this.$notify(obj);
        }
      }
    });

    export default FSToaster;
</script>
