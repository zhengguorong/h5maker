/**
 * Created by Wesdint on 2017/7/13.
 */
var express = require('express')
var controller = require('./statisticalanalysis.controller')
var router = express.Router()

router.post('/', controller.findAnswerById)
router.post('/generateReport', controller.generateReport)
router.get('/:id', controller.downloadExcel)

module.exports = router
