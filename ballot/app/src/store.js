import Vue from 'vue';
import Vuex from 'vuex';

import oasis from '@oasislabs/client';
import config from './config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ballot: null,
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
      const wallet = oasis.Wallet.fromMnemonic(config.MNEMONIC);
      const gateway = new oasis.gateways.Web3Gateway(
        config.WEB3_GATEWAY_URL,
        wallet,
      );

      oasis.setGateway(gateway);
    },
    async deployService({ commit }) {
      await this.dispatch('connectToOasis');

      const bytecode = await fetch(config.BYTECODE)
        .then(response => response.body)
        .then(stream => new Response(stream))
        .then(async (response) => {
          const serviceBinary = await response.arrayBuffer();
          return new Uint8Array(serviceBinary);
        });

      const ballot = await oasis.deploy({
        bytecode,
        arguments: config.BALLOT_ARGS,
        header: { confidential: false },
        options: { gasLimit: '0xf42400' }, // TODO: Remove this, and other gasLimits
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
      return this.state.ballot.vote(candidateNum, { gasLimit: '0xf42400' });
    },
    async closeBallot() {
      return this.state.ballot.close({ gasLimit: '0xf42400' });
    },
    async isAdmin() {
      return this.state.ballot.admin({ gasLimit: '0xf42400' });
    },
    async getBallotID() {
      return this.state.ballot.address;
    },
    async getCandidates() {
      return this.state.ballot.candidates({ gasLimit: '0xf42400' });
    },
    async getDescription() {
      return this.state.ballot.description({ gasLimit: '0xf42400' });
    },
    async getOpen() {
      return this.state.ballot.voting_open({ gasLimit: '0xf42400' });
    },
    async getResults() {
      return this.state.ballot.results({ gasLimit: '0xf42400' });
    },
    async getWinner() {
      return this.state.ballot.winner({ gasLimit: '0xf42400' });
    },
  },
});
