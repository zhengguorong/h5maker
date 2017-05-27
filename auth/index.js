/**
 * Created by zhengguorong on 16/11/2.
 */
const express = require('express')
const User = require('../api/user/user.controller')
const auth = require('../auth/auth.service')

const router = express.Router()

/**
 * 用户登录
 */
router.post('/login', (req, res, next) => {
  User.login(req, res)
})
/**
 * 用户注册
 */
router.post('/register', (req, res, next) => {
  User.create(req, res)
})

router.get('/logout', auth.isAuthenticated(), User.logout)

module.exports = router
