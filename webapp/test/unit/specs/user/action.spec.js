import tools from '../../tools'
const actionsInjector = require('inject!src/vuex/user/actions')

const actions = actionsInjector({
  '../../api/user': {
    login () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, 100)
      })
    }
  }
})

describe('user actions', () => {
  it('用户登录成功', done => {
    tools.testAction(actions.login, [], {}, [
      {type: 'SET_ERROR_INFO', payload: ''}
    ], done)
  })
})
