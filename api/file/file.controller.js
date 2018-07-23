/**
 * Created by zhengguorong on 16/11/4.
 */
var jsonpatch = require('fast-json-patch')
var File = require('./file.model')
var tools = require('../../util/tools')
var uuid = require('node-uuid')
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

const patchUpdates = (patches) => {
  return function (entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true)
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
  return File.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res))
}

// Gets a single File from the DB
module.exports.show = (req, res) => {
  return File.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res))
}

module.exports.getByThemeId = (req, res) => {
  return File.find({ themeId: req.params.id, fileType:req.query.fileType}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res))
}

// Creates a new File in the DB
module.exports.create = (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
  let image = req.files.image;
  var pathInfo = buildImgPath(req.body.themeId || 'all')
  if (image) {
    var ext = '.' + image.mimetype.split('/')[1]
    image.mv(pathInfo.imagePath + ext, err => {
      if (err) {
        return res.status(500).send(err);
      }
      console.log(req.body.themeId, 'themeId')
      return File.create({filePath: pathInfo.accessPath + ext, themeId: req.body.themeId || '', fileType: req.body.fileType, width: req.body.width, height: req.body.height})
      .then(respondWithResult(res, 201))
      .catch(handleError(res))
    })
  }
}

const buildImgPath = (themeId) => {
  // 文件使用uuid生成别名
  var fileName = uuid.v1().replace(/-/g, '')
  // 文件目录
  var dirPath = 'public/upload/' + themeId
  // 创建路径
  fs.existsSync(path.resolve(dirPath)) == false &&tools.mkdirs(dirPath)
  // 图片保存路径
  var imagePath = dirPath + '/' + fileName
  // 图片访问路径
  var accessPath = '/upload/' + themeId + '/' + fileName
  return { accessPath: accessPath, imagePath: imagePath, dirPath: dirPath }
}

// Deletes a File from the DB
module.exports.destroy = (req, res) => {
  return File.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res))
}
