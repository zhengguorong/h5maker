/**
 * Created by zhengguorong on 16/11/4.
 */
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

var PageSchema = new mongoose.Schema({
  pages: {
    type: Array,
    required: true
  },
  title: String,
  description: String,
  html: String,
  createDate: { type: Number, default: new Date().getTime() },
  loginId: String,
  isTemplate: { type: Boolean, default: false },
  templateId: {type: String, default: null},
  type: {
    type: String, required: true, default: 'h5', enum: ['h5', 'spa', 'simple'] // 页面是单页还是多页
  },
  canvasHeight: Number,
  musicLink: String,
  musicName: String,
  musicStyle: String,
  uploadMusicList: Array
})

module.exports = mongoose.model('Page', PageSchema)
