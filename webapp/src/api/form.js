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
const downloadExcelById = (id) => {
  return http.get('/api/downloadExcel/' + id)
}
const uploadPic = (data) => {
  return http.post('/api/upload', {imgData: data})
}

const getAnswer = (data) => {
  return http.post('/api/checkAnswer', {formId: data.id, pageIndex: data.pageIndex, pageSize: data.pageSize})
}

const generateReport = (data) => {
  return http.post('/api/checkAnswer/generateReport', {formId: data.formId})
}

module.exports = {
  createForm, deleteForm, getFormList, getFormById, downloadExcelById, updateForm, uploadPic, getAnswer, generateReport
}
