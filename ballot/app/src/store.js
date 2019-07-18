import Vue from 'vue';
import Vuex from 'vuex';

import oasis from '@oasislabs/client';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ballot: null,
    constructorArgs: [
      'Which starter Pokemon is the best?',
      [
        'Bulbasaur',
        'Charmander',
        'Squirtle',
      ],
    ],
  },
  mutations: {
    setBallot(state, ballot) {
      state.ballot = ballot;
    },
  },
  actions: {
    // Ballot Instantiation
    async connectToOasis () {
      const wallet = oasis.Wallet.fromMnemonic(
        'range drive remove bleak mule satisfy mandate east lion minimum unfold ready'
      );
      const gateway = new oasis.gateways.Web3Gateway(
        'ws://localhost:8546',
        wallet,
      );

      oasis.setGateway(gateway);
    },
    async deployService ({ commit }) {
      await this.dispatch('connectToOasis');

      const bytecode = await fetch('/assets/bytecode/ballot.wasm')
        .then(response => response.body)
        .then(stream => new Response(stream))
        .then(async (response) => {
          const serviceBinary = await response.arrayBuffer();
          return new Uint8Array(serviceBinary);
        });

      const ballot = await oasis.deploy({
        bytecode,
        arguments: this.state.constructorArgs,
        header: { confidential: false },
        options: { gasLimit: '0xf42400' }, // TODO: Remove this
      });

      commit('setBallot', ballot);
    },
    async loadService ({ commit }, address) {
      await this.dispatch('connectToOasis');

      const ballot = oasis.Service.at(address);

      commit('setBallot', ballot);
    },
    // Ballot API
    async castVote ({ commit }, candidateNum) {
      return this.state.ballot.vote(candidateNum);
    },
    async closeBallot () {
      return this.state.ballot.close();
    },
    async getBallotID () {
      return this.state.ballot.address;
    },
    async getCandidates () {
      return this.state.ballot.candidates();
    },
    async getDescription () {
      return this.state.ballot.description();
    },
    async getOpen () {
      return this.state.ballot.voting_open();
    },
    async getResults () {
      return this.state.ballot.results();
    },
    async getWinner () {
      return this.state.ballot.winner();
    },
  },
});
