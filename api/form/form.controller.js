var Form = require('./form.model')

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
  return Form.create(req.body)
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
  return Form.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec()
    .then(respondWithResult(res))
    .catch(handleError(res))
}
