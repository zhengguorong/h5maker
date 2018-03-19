import * as types from './mutation-type'

const mutations = {
  [types.SET_ERROR_INFO] (state, data) {
    state.loginResult = data
  },
  [types.SET_REGISTER_ERROR] (state, data) {
    state.registerError = data
  }
}

export default mutations
