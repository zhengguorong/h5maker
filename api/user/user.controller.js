/**
 * Created by zhengguorong on 16/11/1.
 */
const User = require('./user.model')
const config = require('../../config')
const jwt = require('jsonwebtoken')

/**
 * 处理提交表单验证错误
 * @param res
 * @param statusCode
 * @returns {Function}
 */
const validationError = (res, statusCode) => {
  statusCode = statusCode || 422
  return function (err) {
    return res.status(statusCode).json(err)
  }
}
const respondWithResult = (res, statusCode) => {
  statusCode = statusCode || 200
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity)
    }
    return null
  }
}

const handleError = (res, statusCode) => {
  statusCode = statusCode || 500
  return function (err) {
    return res.status(statusCode).send(err)
  }
}

module.exports.index = (req, res) => {
  return User.find({}, '-salt -password').exec()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(handleError(res))
}

module.exports.findByToken = (token) => {
  return User.findOne({ token: token }).exec()
}

/**
 * 创建用户
 * @param req
 * @param res
 */
module.exports.create = (req, res) => {
  let newUser = new User(req.body)
  newUser.provider = 'local'
  newUser.role = 'user'
  newUser.save()
    .then((user) => {
      let token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      })
      user.token = token
      var updateUser = JSON.parse(JSON.stringify(user))
      delete updateUser._id
      User.findOneAndUpdate({ _id: user._id }, updateUser).exec()
      res.json({ token })
    })
    .catch(validationError(res))
}

/**
 * 获取单个用户信息
 */
module.exports.show = (req, res, next) => {
  let userId = req.params.id
  return User.findById(userId).exec()
    .then(user => {
      if (!user) {
        return res.status(400).end()
      }
      res.json(user.profile)
    })
    .catch(err => next(err))
}

/**
 * 删除用户
 * @param req
 * @param res
 * @returns {Promise.<TResult>|Promise}
 */
module.exports.destroy = (req, res) => {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(() => {
      res.status(204).end()
    })
    .catch(handleError(res))
}

/**
 * 修改密码
 * @param req
 * @param res
 * @returns {Promise.<TResult>}
 */
module.exports.changePassword = (req, res) => {
  var uesrId = req.user._id
  var oldPass = String(req.body.oldPassword)
  var newPass = String(req.body.newPassword)
  return User.findById(uesrId).exec()
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass
        return user.save()
          .then(() => {
            res.status(204).end()
          })
          .catch(validationError(res))
      } else {
        return res.status(403).end()
      }
    })
}

/**
 * 用户登陆
 * @param req
 * @param res
 * @returns {Promise.<TResult>}
 */
module.exports.login = (req, res) => {
  var loginId = req.body.loginId
  var password = req.body.password
  let token
  return User.findOne({ loginId: loginId }).exec()
    .then(user => {
      if (user && user.authenticate(password)) {
        token = jwt.sign({ _id: user._id }, config.secrets.session, {
          expiresIn: 60 * 60 * 5
        })
        user.token = token
        var updateUser = JSON.parse(JSON.stringify(user))
        delete updateUser._id
        User.findOneAndUpdate({ _id: user._id }, updateUser).exec()
        res.status(200).json({ token }).end()
      } else {
        return res.status(401).end()
      }
    })
}

/**
 * 退出登录
 */
module.exports.logout = (req, res) => {
  var userId = req.user._id
  return User.findOneAndUpdate({ _id: userId }, { token: '' }).exec()
    .then(() => {
      res.status(200).end()
    })
    .catch(handleError(res))
}

/**
 * 查看用户信息
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<TResult>|Promise}
 */
module.exports.me = (req, res, next) => {
  var userId = req.user._id
  return User.findOne({ _id: userId }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end()
      }
      res.json(user)
    })
    .catch(err => next(err))
}
