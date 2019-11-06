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
      headers.set('X-OASIS-SESSION-KEY', 'ballot-session');

      const gateway = new oasis.gateways.Gateway(this.state.gateway, this.state.token, { headers });
      oasis.setGateway(gateway);
    },
    async deployService({ commit }) {
      await this.dispatch('connectToOasis');

      const bytecode = await fetch(this.state.bytecode)
        .then((response) => response.body)
        .then((stream) => new Response(stream))
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

      const ballot = await oasis.Service.at(
        oasis.Address(address),
      );

      commit('setBallot', ballot);
    },
    // Ballot API
    async castVote(_context, candidateNum) {
      return this.state.ballot.vote(candidateNum);
    },
    async closeBallot() {
      return this.state.ballot.close();
    },
    async getBallotID() {
      // eslint-disable-next-line
      return this.state.ballot.address.hex;
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
