import Vue from 'vue';
import Router from 'vue-router';

import Welcome from './views/Welcome.vue';
import Vote from './views/Vote.vue';
import Confirmation from './views/Confirmation.vue';
import Results from './views/Results.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: Welcome,
    },
    {
      path: '/vote',
      name: 'vote',
      component: Vote,
    },
    {
      path: '/confirm',
      name: 'confirm',
      component: Confirmation,
    },
    {
      path: '/results',
      name: 'results',
      component: Results,
    },
  ],
});

router.replace({
  path: '*',
  redirect: '/',
});

export default router;
