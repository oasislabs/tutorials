import Vue from 'vue';
import VueApexCharts from 'vue-apexcharts';

import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/vuetify';

Vue.config.productionTip = false;
Vue.component('v-apex-chart', VueApexCharts);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
