/**
 * Created by zhengguorong on 2016/11/30.
 */
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

var FileSchema = new mongoose.Schema({
  filePath: {
    type: String,
    required: true
  },
  fileType: String,
  width: Number,
  height: Number,
  fileName: String,
  createDate: { type: Number, default: new Date().getTime() },
  themeId: {
    type: String
  }
})

module.exports = mongoose.model('File', FileSchema)
