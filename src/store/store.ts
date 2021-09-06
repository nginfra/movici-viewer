import Vue from 'vue';
import Vuex from 'vuex';
import organisations from './modules/organisations';
import modelTypes from './modules/modelTypes';
import general from './modules/general';
import users from './modules/users';
import authorization from './modules/authorization';
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    general,
    organisations,
    modelTypes,
    users,
    authorization
  }
});

export default store;
