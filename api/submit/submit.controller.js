var Submit = require('./submit.model')
var Form = require('../form/form.model')
var request = require('request')
var validateFuns = require('../../public/libs/js/vaildate')
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
    res.status(statusCode).send(err)
  }
}

const validate = (data) => {
  for (var i = 0; i < data.result.length; i++) {
    var question = data.result[i]
    var ask = data.result[i].ask
    // 验证必填项
    if (question.qsIsMust && ask.length === 0) {
      return {responseMsg: '请完成' + question.question}
    }
    // 验证手机号
    if (ask.length > 0 && question.qsValidate === 'phone' && !validateFuns.isMobile(ask)) {
      return {responseMsg: '手机号码格式不正确哦'}
    }
    // 验证邮箱
    if (ask.length > 0 && question.qsValidate === 'email' && !validateFuns.isEmail(ask)) {
      return {responseMsg: '邮箱格式不正确哦'}
    }
    // 验证数字
    if (ask.length > 0 && question.qsValidate === 'num' && !validateFuns.isNum(ask)) {
      return {responseMsg: '请输入纯数字哦'}
    }
    // 验证上传图片张数限制
    if (ask.length > 0 && question.qsType === 'file' && ask.length > question.count) {
      return {responseMsg: '上传文件数超出限制啦'}
    }
  }
}

module.exports.create = (req, res) => {
  if (req.body.formId === '') {
    return res.json({responseCode: 0, responseMsg: '不是有效的问卷'})
  } else {
    let valiRes = validate(req.body)
    if (!valiRes) {
     // 保存用户请求的ip地址
      let ipAddress
      let forwardedIpsStr = req.header('x-forwarded-for')
      if (forwardedIpsStr) {
        let forwardedIps = forwardedIpsStr.split(',')
        ipAddress = forwardedIps[0]
      }
      if (!ipAddress) {
        ipAddress = req.connection.remoteAddress
      }
      let url = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?ip=' + ipAddress + '&format=json'
     // 解析ip地址的地理位置
      return request(url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          if (body == -2 || JSON.parse(body).ret == -1) {
            ipAddress = ipAddress + '(本地局域网)'
          } else {
            body = JSON.parse(body)
            ipAddress = ipAddress + '(' + body.province + body.city + ')'
          }
          req.body.ip = ipAddress
          Form.update({ '_id': req.body.formId}, {$inc: {answerNum: 1}}, function (err, result) {
            console.log(err)
          })
          return Submit.create(req.body)
                    .then(respondWithResult(res, 201))
                    .catch(handleError(res))
        }
      })
    } else {
      res.json(Object.assign(valiRes, {responseCode: 0}))
    }
  }
}
