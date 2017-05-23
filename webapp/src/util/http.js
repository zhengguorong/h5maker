import axios from 'axios'
import appConst from './appConst'
export const get = (url, query) => {
  const token = 'Bearer ' + window.localStorage.token
  let _url
  if (query) {
    _url = `${appConst.BACKEND_DOMAIN}${url}?${query}`
  } else {
    _url = `${appConst.BACKEND_DOMAIN}${url}`
  }
  return axios.get(_url, {
    headers: { authorization: token }
  })
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        return res.data
      }
    })
    .catch((err) => {
      errorProcess(err)
      return Promise.reject(err)
    })
}

export const post = (url, query) => {
  const token = 'Bearer ' + window.localStorage.token
  let _url = `${appConst.BACKEND_DOMAIN}${url}`
  return axios.post(_url, query, {
    headers: { authorization: token }
  })
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        return res.data
      }
    })
    .catch((err) => {
      errorProcess(err)
      return Promise.reject(err)
    })
}

export const put = (url, query) => {
  const token = 'Bearer ' + window.localStorage.token
  let _url = `${appConst.BACKEND_DOMAIN}${url}`
  return axios.put(_url, query, {
    headers: { authorization: token }
  })
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        return res.data
      }
    })
    .catch((err) => {
      errorProcess(err)
      return Promise.reject(err)
    })
}

export const patch = (url, query) => {
  const token = 'Bearer ' + window.localStorage.token
  let _url = `${appConst.BACKEND_DOMAIN}${url}`
  return axios.patch(_url, query, {
    headers: { authorization: token }
  })
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        return res.data
      }
    })
    .catch((err) => {
      errorProcess(err)
      return Promise.reject(err)
    })
}

export const del = (url, article) => {
  const token = 'Bearer ' + window.localStorage.token
  let _url = `${appConst.BACKEND_DOMAIN}${url}/${article._id}`
  return axios.delete(_url, {
    headers: { authorization: token }
  })
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        return res.data
      }
    })
    .catch((err) => {
      errorProcess(err)
      return Promise.reject(err)
    })
}

const errorProcess = (err) => {
  if (err.response.status === 401) {
    window.location.href = '#/login'
  }
}
