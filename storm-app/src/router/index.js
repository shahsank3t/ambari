import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
import HelloTest from '@/components/HelloTest';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello,
    },
    {
      path: '/test',
      name: 'Hello-test',
      component: HelloTest,
    },
  ],
});
