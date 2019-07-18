import Vue from 'vue';
import VueApexCharts from 'vue-apexcharts';
import oasis from '@oasislabs/client';

import App from './App.vue';
import router from './router';
import './plugins/vuetify';

let SecretBallot;

const wallet = oasis.Wallet.fromMnemonic('range drive remove bleak mule satisfy mandate east lion minimum unfold ready');

// Ethereum gateway responsible for signing transactions.
const gateway = new oasis.gateways.Web3Gateway('ws://localhost:8546', wallet);

oasis.setGateway(gateway);

// Ballot Instantiation
window.deployService = async (constructorArgs) => {
  const bytecode = await fetch('/assets/bytecode/ballot.wasm')
    .then(response => response.body)
    .then(stream => new Response(stream))
    .then(async (response) => {
      const serviceBinary = await response.arrayBuffer();
      return new Uint8Array(serviceBinary);
    });

  SecretBallot = await oasis.deploy({
    bytecode,
    arguments: constructorArgs,
    header: { confidential: false },
    options: { gasLimit: '0xf42400' }, // TODO: Remove this
  });
};

window.loadService = async (address) => {
  SecretBallot = oasis.Service.at(address);
};

// Ballot API
window.castVote = async (candidateNum) => SecretBallot.vote(candidateNum);

window.closeBallot = async () => SecretBallot.close();

window.getCandidates = async () => SecretBallot.candidates();

window.getDescription = async () => SecretBallot.description();

window.getOpen = async () => SecretBallot.voting_open();

window.getResults = async () => SecretBallot.results();

window.getWinner = async () => SecretBallot.winner();

Vue.config.productionTip = false;
Vue.component('v-apex-chart', VueApexCharts);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
