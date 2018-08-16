'use strict';
import Vue from 'vue';
import Vuex from 'vuex';

import actions from './actions'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex);

let localStorageUser = localStorage.user;
const state = {
  user: localStorageUser ? JSON.parse(localStorageUser) : {},
  getUserInfo: true,
  invitee: {}
};

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations
});