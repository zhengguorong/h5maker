var Submit = require('./submit.model')

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

module.exports.create = (req, res) => {
  return Submit.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res))
}
