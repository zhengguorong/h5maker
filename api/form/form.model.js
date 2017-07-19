const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

var FormSchema = new mongoose.Schema({
  questions: {
    type: Array
  },
  title: String,
  description: String,
  createDate: { type: Number, default: new Date().getTime() },
  loginId: String,
  answerNum: { type: Number, default: 0}
})

module.exports = mongoose.model('Form', FormSchema)
