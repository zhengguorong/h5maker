/**
 * Created by zhengguorong on 16/11/4.
 */
var express = require('express')
var controller = require('./pages.controller')
const auth = require('../../auth/auth.service')

var router = express.Router()

router.get('/', auth.isAuthenticated(), controller.findByLoginId)
router.get('/:id', auth.isAuthenticated(), controller.show)
router.post('/', auth.isAuthenticated(), controller.create)
router.put('/:id', auth.isAuthenticated(), controller.update)
router.patch('/:id', auth.isAuthenticated(), controller.patch)
router.delete('/:id', auth.isAuthenticated(), controller.destroy)

module.exports = router
