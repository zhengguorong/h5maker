/**
 * Created by Wesdint on 2017/7/13.
 */
var express = require('express')
var controller = require('./statisticalanalysis.controller')
var router = express.Router()

router.post('/', controller.findAnswerById)

module.exports = router