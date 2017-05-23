/**
 * Created by zhengguorong on 16/11/1.
 */
const express = require('express')
const controller = require('./user.controller')
const auth = require('../../auth/auth.service')

var router = new express.Router()

router.get('/', auth.hasRole('admin'), controller.index)
router.delete('/:id', auth.hasRole('admin'), controller.destroy)
router.get('/me', auth.isAuthenticated(), controller.me)
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword)
router.get('/:id', auth.isAuthenticated(), controller.show)
router.post('/', controller.create)

module.exports = router
