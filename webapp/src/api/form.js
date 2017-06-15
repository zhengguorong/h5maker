import * as http from '../util/http'

const createForm = (form) => {
  return http.post('/api/form', form)
}

const deleteForm = (form) => {
  return http.del('/api/form', form)
}

const getFormList = () => {
  return http.get('/api/form')
}

module.exports = {
  createForm, deleteForm, getFormList
}
