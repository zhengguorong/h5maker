/**
 * Created by Wesdint on 2017/7/14.
 */
var Answer = require('../submit/submit.model')
var async = require('async')
module.exports.findAnswerById = (req, res) => {
  let formId = req.body.formId
  let pageIndex = req.body.pageIndex
  let pageSize = req.body.pageSize

  async.parallel({
    count: (done) => {
      Answer.count({formId: formId}).exec((err, count) => {
        done(err, count)
      })
    },
    records: (done) => {
      Answer.find({formId: formId}).sort({createDate: -1}).skip(pageSize * (pageIndex-1)).limit(pageSize).exec((err, doc) => {
        done(err, doc)
      })
    }
  }, (err, result) => {
    res.json(result)
  })
}