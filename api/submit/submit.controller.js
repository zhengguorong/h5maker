var Submit = require('./submit.model')
var Form = require('../form/form.model')
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
  return Form.findById(data.formId).then((resData) => {
    for(var i=0;i<resData.questions.length;i++) {
      var question = resData.questions[i]
      var ask = data.result[i].ask
      // 验证必填项
      if (question.isMust && ask.length === 0) {
        return {responseMsg: '请完成'+ question.title}
      }
      // 验证手机号
      if (ask.length > 0 && question.validate === 'phone' && !validateFuns.isMobile(ask)) {
        return {responseMsg: '手机号码格式不正确哦'}
      }
      // 验证邮箱
      if (ask.length > 0 && question.validate === 'email' && !validateFuns.isEmail(ask)) {
        return {responseMsg: '邮箱格式不正确哦'}
      }
      // 验证数字
      if (ask.length > 0 && question.validate === 'num' && !validateFuns.isNum(ask)) {
        return {responseMsg: '请输入纯数字哦'}
      }
      // 验证上传图片张数限制
      if (ask.length > 0 && question.qsType === 'file' && ask.length > question.count ) {
        return {responseMsg: '上传文件数超出限制啦'}
      }
    }
  })
}

module.exports.create = (req, res) => {
 if (req.body.formId === '') {
   return res.json({responseCode: 0, responseMsg: '不是有效的问卷'})
 }
 else {
   validate(req.body).then((valiRes) => {
     if (!valiRes) {
       let ipAddress
       let forwardedIpsStr = req.header('x-forwarded-for')
       if (forwardedIpsStr) {
         let forwardedIps = forwardedIpsStr.split(',')
         ipAddress = forwardedIps[0]
       }
       if (!ipAddress) {
         ipAddress = req.connection.remoteAddress
       }
       console.log(ipAddress)
       return Submit.create(req.body)
           .then(respondWithResult(res, 201))
           .catch(handleError(res))
     } else {
       res.json(Object.assign(valiRes, {responseCode: 0}))
     }
   })

 }
}
