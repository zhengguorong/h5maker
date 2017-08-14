var express = require('express')
var controller = require('./form.controller')
const auth = require('../../auth/auth.service')

var router = express.Router()

router.get('/', auth.isAuthenticated(), controller.findByLoginId)
router.get('/miniPrograms', controller.getIdList)
router.get('/:id', controller.show)
router.post('/', auth.isAuthenticated(), controller.create)
router.put('/:id', auth.isAuthenticated(), controller.update)
router.delete('/:id', auth.isAuthenticated(), controller.destroy)

module.exports = router
