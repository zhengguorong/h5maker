import { expect } from 'chai'
import mutations from 'src/vuex/user/mutations'

var state = {
  loginResult: ''
}

describe('user mutations', () => {
  it('提示错误信息', () => {
    mutations.SET_ERROR_INFO(state, '账号或者密码错误')
    expect(state.loginResult).to.equal('账号或者密码错误')
  })
})
