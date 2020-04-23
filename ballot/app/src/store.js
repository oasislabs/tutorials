import Vue from 'vue';
import Vuex from 'vuex';
import {Address, Gateway} from 'oasis-std';

import {Ballot} from '../service-clients/ballot';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    args: {
      description: 'Which starter Pokemon is the best?',
      candidates: ['Bulbasaur', 'Charmander', 'Squirtle'],
    },
    ballot: null,
    deployLocally: process.env.NODE_ENV === 'development',
    // For deploying against a local `oasis chain`
    localGateway: 'http://localhost:1234',
    localCredential: 'AAAAAhq2tOs8hDVZLUob7LDnb1SsBS2ZGV3zIguKznK5jv/J',
    // For deploying against the Oasis Gateway
    productionGateway: 'https://gateway.devnet.oasiscloud.io',
    productionCredential: 'AAAAAhq2tOs8hDVZLUob7LDnb1SsBS2ZGV3zIguKznK5jv/J',
    gateway: null,
  },
  mutations: {
    /* eslint no-param-reassign: ["error", { "props": false }] */
    setBallot(state, ballot) {
      state.ballot = ballot;
    },
    setGateway(state, gateway) {
      state.gateway = gateway;
    },
  },
  actions: {
    // Ballot Instantiation
    async connectToOasis() {
      const gatewayUrl = this.state.deployLocally
        ? this.state.localGateway
        : this.state.productionGateway;
      const gatewayCredential = this.state.deployLocally
        ? this.state.localCredential
        : this.state.productionCredential;

      const gateway = new Gateway(gatewayUrl, gatewayCredential);
      commit('setGateway', gateway);
    },
    async deployService({commit}) {
      await this.dispatch('connectToOasis');
      const ballot = await Ballot.deploy(this.state.gateway, this.state.args);
      commit('setBallot', ballot);
    },
    async loadService({commit}, address) {
      await this.dispatch('connectToOasis');
      const ballot = new Ballot(new Address(address));
      commit('setBallot', ballot);
    },
    // Ballot API
    async castVote(_context, candidateNum) {
      return this.state.ballot.vote({candidateNum});
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
