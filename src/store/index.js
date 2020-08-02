import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggedUser: false,
    username: ''
  },
  mutations: {
    logUser (state, payload) {
      state.loggedUser = true;
      state.username = payload;
    },
    logout (state) {
      state.loggedUser = false;
      state.username = '';
    }
  },
  actions: {
    logUser (context, payload) {
      context.commit('logUser', payload)
    },
    logout (context) {
      context.commit('logout')
    }
  },
  getters: {
    userIsLogged: state => {
      return state.loggedUser;
    },
    username: state => {
      return state.username;
    }
  }
})
