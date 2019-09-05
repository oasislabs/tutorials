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
    gateway: 'ws://localhost:8546',
    mnemonic: 'range drive remove bleak mule satisfy mandate east lion minimum unfold ready',
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
      const wallet = oasis.Wallet.fromMnemonic(this.state.mnemonic);
      const gateway = new oasis.gateways.Web3Gateway(
        this.state.gateway,
        wallet,
      );

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

      const ballot = await oasis.deploy({
        bytecode,
        arguments: this.state.args,
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
    async getBallotID() {
      return this.state.ballot._inner.address;
    },
    async getCandidates() {
      return this.state.ballot.candidates({ gasLimit: '0xf42400' });
    },
    async getDescription() {
      return this.state.ballot.description({ gasLimit: '0xf42400' });
    },
    async getOpen() {
      return this.state.ballot.votingOpen({ gasLimit: '0xf42400' });
    },
    async getResults() {
      return this.state.ballot.results({ gasLimit: '0xf42400' });
    },
    async getWinner() {
      return this.state.ballot.winner({ gasLimit: '0xf42400' });
    },
  },
});
