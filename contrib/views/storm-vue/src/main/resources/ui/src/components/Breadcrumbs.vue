<template>
   <ol id="breadcrumb">
     <li v-for="item in items">
       <a v-if="item.link === '#/' " :href="item.link"><i class="fa fa-home"></i></a>
       <a v-else :href="item.link">{{item.title}}</a>
     </li>
   </ol>
</template>
<script>
  export default{
    name : "Breadcrumbs",
    props : ['items']
  };
</script>
