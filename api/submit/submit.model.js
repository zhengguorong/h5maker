const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

var SubmitSchema = new mongoose.Schema({
  result: {
    type: Array
  },
  createDate: { type: Number, default: Date.now },
  loginId: String,
  formId: String,
  ip: String,
  sourcePlatform: String,
  timeStamp: Number
})

module.exports = mongoose.model('Submit', SubmitSchema)
