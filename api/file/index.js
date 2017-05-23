/**
 * Created by zhengguorong on 16/11/4.
 */
var express = require('express')
var controller = require('./file.controller')
const auth = require('../../auth/auth.service')

var router = express.Router()

router.get('/', auth.isAuthenticated(), controller.index)
router.get('/theme/:id', auth.isAuthenticated(), controller.getByThemeId)
router.get('/:id', controller.show)
router.post('/', controller.create)
router.delete('/:id', auth.isAuthenticated(), controller.destroy)

module.exports = router
