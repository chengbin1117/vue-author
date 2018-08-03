import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

if (process.env.NODE_ENV === 'development') {
  Vue.use(Vuex)
}

// store对象
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

export default store
