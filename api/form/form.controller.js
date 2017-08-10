var Form = require('./form.model')
var tools = require('../../util/tools')
var request = require('request')
var fs = require('fs')
var path = require('path')

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

const handleEntityNotFound = (res) => {
  return function (entity) {
    if (!entity) {
      res.status(404).end()
      return null
    }
    return entity
  }
}

const removeEntity = (res) => {
  return function (entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end()
        })
    }
  }
}

module.exports.findByLoginId = (req, res) => {
  var loginId = req.user.loginId
  return Form.find({loginId: loginId}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res))
}
// 返回特定用户的可填写问卷id
module.exports.getIdList = (req, res) => {
  return Form.find({loginId: 'zwd'}).exec()
      .then(formList => {
        var result = {
          responseCode: 1,
          idList: []
        }
        for(let i = 0; i < formList.length; i++) {
          result.idList.push({id: formList[i]._id, name: formList[i].title})
        }
        res.json(result)
      })
      .catch(handleError(res))
}

// 获取微信小程序token
const getMpToken = (req, res) => {
  let wxTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxdb2d726ec58b2ef8&secret=8517f266511c20fd6e22ea3416b9e1db'
  let timeDiff = (new Date().getTime() - global.wxTokenTimestamp) / 1000 // 获取token时长(秒)（token两小时过期）
  return function (entity) {
    return new Promise((resolve, reject) => {
      if(global.wxTokenTimestamp && timeDiff < 7000) {
        resolve(entity)
      } else {
        request(wxTokenUrl, (error, response, body) =>{
          if (!error) {
            global.wxTokenTimestamp = new Date().getTime()
            global.mp_access_token = JSON.parse(body).access_token
            resolve(entity)
          } else {
            res.end()
          }
        })
      }
    })
  }
}
// 生成微信小程序二维码
const generateMpQcode = () => {
  return function (entity) {
    let QRPath = path.join(__dirname, '../../public/QR/') + entity._id
    return new Promise((resolve, reject) => {
      let wxQcodeUrl = 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + global.mp_access_token
      request({url: wxQcodeUrl, method: 'POST', json: true, body: {"scene": entity._id, "width": 180}})
          .pipe(fs.createWriteStream(QRPath + '.jpeg').on('finish', () => {
           Form.update({'_id': entity._id}, {$set: {'wxMpQR': '/QR/' + entity._id + '.jpeg'}})
               .then(() => {resolve(entity)})
      }).on('error', () => {resolve(entity)}))
    })
  }
}

module.exports.show = (req, res) => {
  return Form.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res))
}

// Creates a new From in the DB
module.exports.create = (req, res) => {
  // 添加作者信息
  req.body.loginId = req.user.loginId
  // 获取对应小程序二维码
  return Form.create(req.body)
      .then(getMpToken(res))
      .then(generateMpQcode())
      .then(respondWithResult(res, 201))
      .catch(handleError(res))
}

module.exports.destroy = (req, res) => {
  return Form.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res))
}
module.exports.update = (req, res) => {
  if (req.body._id) {
    delete req.body._id
  }
  tools.renderFile('form.html', req.body, (html) => {
    tools.saveFile(req.params.id + '.html', html)
  })
  return Form.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec()
    .then(respondWithResult(res))
    .catch(handleError(res))
}
