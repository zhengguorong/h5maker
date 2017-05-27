import * as http from '../util/http'

const login = (userInfo) => {
  return http.post('/auth/login', userInfo)
}
const register = (userInfo) => {
  return http.post('/auth/register', userInfo)
}
const logout = () => {
  return http.get('/auth/logout')
}

module.exports = {
  login, register, logout
}
