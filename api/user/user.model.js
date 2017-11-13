const crypto = require('crypto')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

var UserSchema = new mongoose.Schema({
  name: String,
  loginId: {
    type: String,
    lowercase: true,
    required: true
  },
  role: {
    type: String,
    default: 'user'
  },
  password: {
    type: String,
    required: true
  },
  provider: String,
  salt: String,
  token: String
})

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('loginId')
  .validate((loginId) => {
    return loginId.length
  }, '登陆名不能空')

// Validate empty password
UserSchema
  .path('password')
  .validate((password) => {
    return password.length
  }, '密码不能空')

// Validate loginId is not taken
UserSchema
  .path('loginId')
  .validate(function (value, respond) {
    return this.constructor.findOne({ loginId: value }).exec()
      .then(user => {
        if (user) {
          if (this.id === user.id) {
            return respond(true)
          }
          return respond(false)
        }
        return respond(true)
      })
      .catch((err) => {
        throw err
      })
  }, '该用户已存在')

var validatePresenceOf = (value) => {
  return value && value.length
}

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function (next) {
    // Handle new/update passwords
    if (!this.isModified('password')) {
      return next()
    }

    if (!validatePresenceOf(this.password)) {
      return next(new Error('密码错误'))
    }

    // Make salt with a callback
    this.makeSalt((saltErr, salt) => {
      if (saltErr) {
        return next(saltErr)
      }
      this.salt = salt
      this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
        if (encryptErr) {
          return next(encryptErr)
        }
        this.password = hashedPassword
        return next()
      })
    })
  })

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate (password, callback) {
    if (!callback) {
      return this.password === this.encryptPassword(password)
    }

    this.encryptPassword(password, (err, pwdGen) => {
      if (err) {
        return callback(err)
      }

      if (this.password === pwdGen) {
        return callback(null, true)
      } else {
        return callback(null, false)
      }
    })
  },

  /**
   * Make salt
   *
   * @param {Number} [byteSize] - Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt (byteSize, callback) {
    var defaultByteSize = 16

    if (typeof arguments[0] === 'function') {
      callback = arguments[0]
      byteSize = defaultByteSize
    } else if (typeof arguments[1] === 'function') {
      callback = arguments[1]
    } else {
      throw new Error('却少回调方法')
    }

    if (!byteSize) {
      byteSize = defaultByteSize
    }

    return crypto.randomBytes(byteSize, (err, salt) => {
      if (err) {
        return callback(err)
      } else {
        return callback(null, salt.toString('base64'))
      }
    })
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword (password, callback) {
    if (!password || !this.salt) {
      if (!callback) {
        return null
      } else {
        return callback('却少密码或者加密内容')
      }
    }

    var defaultIterations = 10000
    var defaultKeyLength = 64
    var salt = new Buffer(this.salt, 'base64')

    if (!callback) {
      return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, 'sha1')
        .toString('base64')
    }

    return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, 'sha1', (err, key) => {
      if (err) {
        return callback(err)
      } else {
        return callback(null, key.toString('base64'))
      }
    })
  }
}

module.exports = mongoose.model('User', UserSchema)
