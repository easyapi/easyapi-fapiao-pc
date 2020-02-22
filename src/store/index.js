import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  accessToken: localStorage.getItem('accessToken'),
};

export default new Vuex.Store({
  state
})


