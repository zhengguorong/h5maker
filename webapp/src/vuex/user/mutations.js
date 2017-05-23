import * as types from './mutation-type'

const mutations = {
  [types.SET_ERROR_INFO] (state, data) {
    state.loginResult = data
  }
}

export default mutations
