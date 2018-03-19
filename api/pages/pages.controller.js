/**
 * Created by zhengguorong on 16/11/4.
 */
var jsonpatch = require('fast-json-patch')
var Pages = require('./pages.model')
var tools = require('../../util/tools')
var mkdirp = require('mkdirp')
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

const patchUpdates = (patches) => {
  return function (entity) {
    try {
      jsonpatch.apply(entity, patches, true)
    } catch (err) {
      return Promise.reject(err)
    }

    return entity.save()
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

const handleEntityNotFound = (res) => {
  return function (entity) {
    if (!entity) {
      res.status(404).end()
      return null
    }
    return entity
  }
}

const handleError = (res, statusCode) => {
  statusCode = statusCode || 500
  return function (err) {
    res.status(statusCode).send(err)
  }
}

module.exports.index = (req, res) => {
  return Pages.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res))
}

module.exports.findByLoginId = (req, res) => {
  var loginId = req.user.loginId
  var type = req.query.type
  return Pages.find({ loginId: loginId, type: type }).exec()
    .then(respondWithResult(res))
    .catch(handleError(res))
}

// Gets a single Pages from the DB
module.exports.show = (req, res) => {
  return Pages.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res))
}
// 获取模板作品
module.exports.worksTemplate = (req, res) => {
  var loginId = req.params.id
  var condition
  if (loginId === 'all') {
    condition = {
      isTemplate: true
    }
  } else {
    condition = {
      loginId: loginId,
      isTemplate: true
    }
  }
  return Pages.find(condition).exec()
    .then(respondWithResult(res))
    .catch(handleError(res))
}
// Creates a new Pages in the DB
module.exports.create = (req, res) => {
  // 添加作者信息
  req.body.loginId = req.user.loginId
  return Pages.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res))
}

// 通过模板创建作品
module.exports.createByTemplate = (req, res) => {
  var templateId = req.body.templateId
  // var newWorksId
  // return Pages.create(req.body)
  //   .then((newWorksDoc) => {
  //     newWorksId = newWorksDoc._id
  //     return Pages.findById(templateId)
  //   })
  //   .then((templateDoc) => {
  //     var newData = JSON.parse(JSON.stringify(templateDoc))
  //     delete newData._id
  //     delete newData.createDate
  //     delete newData.loginId
  //     return Pages.findOneAndUpdate({ _id: newWorksId }, newData, { upsert: true, setDefaultsOnInsert: true, runValidators: true })
  //   })
  Pages.findById(templateId)
    .then(templateDoc => {
      var newData = JSON.parse(JSON.stringify(templateDoc))
      delete newData._id
      delete newData.createDate
      delete newData.loginId
      // 添加作者信息
      newData.loginId = req.user.loginId
      newData.templateId = req.body.templateId
      newData.type = req.body.type
      newData.isTemplate = false
      return Pages.create(newData)
    })
    .then(respondWithResult(res, 201))
    .catch(handleError(res))
}

// Upserts the given Pages in the DB at the specified ID
module.exports.update = (req, res) => {
  if (req.body._id) {
    delete req.body._id
  }
  if (req.body.type === 'h5') {
    tools.renderFile('template.html', req.body, (html) => {
      tools.saveFile(req.params.id + '.html', html, '', () => { // 把生成的h5页面转为缩略图
        var dirpath = path.join(__dirname, '../../public/screenshot')
        var filename = req.params.id + '.png'
        var localUrl = 'http://localhost:3000/pages/' + req.params.id + '.html'
        mkdirp(dirpath, (err) => {
          console.log(err)
          if (err) {
            throw new Error(err)
          } else {
            tools.html2img(localUrl, dirpath + '/' + filename)
          }
        })
      })
    })
  } else if (req.body.type === 'spa') {
    tools.renderFile('spa.html', req.body, (html) => {
      tools.saveFile(req.params.id + '.html', html)
    })
  } else if (req.body.type === 'simple') {
    tools.renderFile('simple.html', req.body, (html) => {
      tools.saveFile(req.params.id + '.html', html)
    })
  }

  return Pages.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec()
    .then(respondWithResult(res))
    .catch(handleError(res))
}

// Updates an existing Pages in the DB
module.exports.patch = (req, res) => {
  if (req.body._id) {
    delete req.body._id
  }
  return Pages.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res))
}

// Deletes a Pages from the DB
module.exports.destroy = (req, res) => {
  return Pages.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res))
}
