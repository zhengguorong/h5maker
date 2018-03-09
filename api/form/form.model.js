const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

var FormSchema = new mongoose.Schema({
  questions: {
    type: Array
  },
  title: String,
  description: String,
  createDate: { type: Number, default: Date.now() },
  loginId: String,
  answerNum: { type: Number, default: 0 },
  wxMpQR: String
})

module.exports = mongoose.model('Form', FormSchema)
