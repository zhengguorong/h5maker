import api from '../../api/user'

export const login = ({commit}, userInfo) => {
  api.login(userInfo).then((res) => {
    commit('SET_ERROR_INFO', '')
    window.localStorage.setItem('token', res.token)
    window.localStorage.setItem('loginId', userInfo.loginId)
    window.location.replace('#/themeList')
  })
    .catch(res => {
      if (res.response.status === 401) {
        commit('SET_ERROR_INFO', '用户名或密码错误')
      }
    })
}

export const register = ({commit}, userInfo) => {
  api.register(userInfo)
    .then((res) => {
      window.localStorage.setItem('token', res.token)
      window.location.replace('#/themeList')
    })
}

export const logout = ({commit}) => {
  return api.logout()
}
