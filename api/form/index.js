var express = require('express')
var controller = require('./form.controller')
const auth = require('../../auth/auth.service')

var router = express.Router()

router.get('/', auth.isAuthenticated(), controller.findByLoginId)
router.get('/:id', auth.isAuthenticated(), controller.show)
router.post('/', auth.isAuthenticated(), controller.create)
router.delete('/:id', auth.isAuthenticated(), controller.destroy)

module.exports = router
