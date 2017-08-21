<template>
  <div id="app" class="container-fluid">
    <router-view></router-view>
    <app-footer></app-footer>
    <notifications />
  </div>
</template>

<script>
import Footer from '@/components/Footer';
export default {
  name: 'app',
  components : {
    'app-footer' : Footer
  }
};
</script>
