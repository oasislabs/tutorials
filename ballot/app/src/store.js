import Vue from 'vue';
import Vuex from 'vuex';

import oasis from '@oasislabs/client';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    args: [
      'Which starter Pokemon is the best?',
      [
        'Bulbasaur',
        'Charmander',
        'Squirtle',
      ],
    ],
    ballot: null,
    bytecode: '/assets/ballot.wasm',
    gateway: 'https://gateway.devnet.oasiscloud.io',
    token: 'AAAAAhq2tOs8hDVZLUob7LDnb1SsBS2ZGV3zIguKznK5jv/J',
    /*
     * Note: If you are copying this template you should modify it to interact with services
     * via the Oasis developer gateway, as opposed to a locally-running blockchain. Your Oasis
     * client will sign transactions for you locally in-browser using a Deoxysii key.
     *
     * https://github.com/oasislabs/deoxysii
     */
  },
  mutations: {
    /* eslint no-param-reassign: ["error", { "props": false }] */
    setBallot(state, ballot) {
      state.ballot = ballot;
    },
  },
  actions: {
    // Ballot Instantiation
    async connectToOasis() {
      const headers = new Map();
      headers.set('X-OASIS-LOGIN-TOKEN', this.state.token);
      headers.set('X-OASIS-SESSION-KEY', 'ballot-session');

      const gateway = new oasis.gateways.Gateway(this.state.gateway, null, { headers });
      oasis.setGateway(gateway);
    },
    async deployService({ commit }) {
      await this.dispatch('connectToOasis');

      const bytecode = await fetch(this.state.bytecode)
        .then(response => response.body)
        .then(stream => new Response(stream))
        .then(async (response) => {
          const serviceBinary = await response.arrayBuffer();
          return new Uint8Array(serviceBinary);
        });

      const ballot = await oasis.deploy(...this.state.args, {
        bytecode,
        gasLimit: '0xf42400',
      });

      commit('setBallot', ballot);
    },
    async loadService({ commit }, address) {
      await this.dispatch('connectToOasis');

      const ballot = await oasis.Service.at(address);

      commit('setBallot', ballot);
    },
    // Ballot API
    async castVote({_}, candidateNum) {
      return this.state.ballot.vote(candidateNum);
    },
    async closeBallot() {
      return this.state.ballot.close();
    },
    async getBallotID() {
      return this.state.ballot._inner.address;
    },
    async getCandidates() {
      return this.state.ballot.candidates();
    },
    async getDescription() {
      return this.state.ballot.description();
    },
    async getOpen() {
      return this.state.ballot.votingOpen();
    },
    async getResults() {
      return this.state.ballot.results();
    },
    async getWinner() {
      return this.state.ballot.winner();
    },
  },
});
