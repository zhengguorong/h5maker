const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

var SubmitSchema = new mongoose.Schema({
  result: {
    type: Array
  },
  createDate: { type: Number, default: new Date().getTime() },
  loginId: String,
  formId: String
})

module.exports = mongoose.model('Submit', SubmitSchema)
