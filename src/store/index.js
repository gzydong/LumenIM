import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import talks from './modules/talk';
import notify from './modules/notify';
import states from './states';
import getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    notify,
    talks
  },

  // 根级别的 state
  state: states,

  getters,

  // 根级别的 mutation
  mutations
});

export default store;
