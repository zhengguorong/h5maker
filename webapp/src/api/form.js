import * as http from '../util/http'

const createForm = (form) => {
  return http.post('/api/form', form)
}

const deleteForm = (form) => {
  return http.del('/api/form', form)
}

const updateForm = (form) => {
  return http.put('/api/form/' + form._id, form)
}

const getFormList = () => {
  return http.get('/api/form')
}

const getFormById = (id) => {
  return http.get('/api/form/' + id)
}

const uploadPic = (data) => {
  return http.post('/api/upload', {imgData: data})
}

module.exports = {
  createForm, deleteForm, getFormList, getFormById, updateForm, uploadPic
}
