import Vue from 'vue';
import VueApexCharts from 'vue-apexcharts';

import App from './App.vue';
import './plugins/vuetify';
import router from './router';

import oasis from '@oasislabs/client';

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
      const bytecode = await response.arrayBuffer();
      return new Uint8Array(bytecode);
    });
  
  SecretBallot = await oasis.deploy({
    bytecode,
    arguments: constructorArgs,
    header: { confidential: false },
    options: { gasLimit: '0xe42400' }, // TODO: Remove this
  }).then((service) => {
    return service;
  });

  console.log('deployed');
};

window.loadService = async (address) => {
  SecretBallot = oasis.Service.at(address);
}

// Ballot API
window.getCandidates = async () => {
  return SecretBallot.candidates();
}

window.getDescription = async () => {
  return SecretBallot.description();
}

window.getWinner = async () => {
  return SecretBallot.winner();
}

window.castVote = async (candidateNum) => {
  SecretBallot.vote(candidateNum);
}

window.closeBallot = async () => {
  SecretBallot.close();
}

Vue.config.productionTip = false;
Vue.component('v-apex-chart', VueApexCharts);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
