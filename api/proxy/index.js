/**
 * Created by Wesdint on 2017/7/10.
 */
var express = require('express')
var router = express.Router()
var request = require('request')

router.post('/', (req, res) => {
  let httpMethod = req.method.toUpperCase()
  let proxyUrl = 'https://mallapi.bluemoon.com.cn/moonRegion/region/getRegionSelect.action'
  let opt = {
    headers: {'Connection': 'close'},
    url: proxyUrl,
    method: httpMethod,
    json: true,
    body: req.body
  }

  let callback = (error, response, data) => {
    if (!error && response.statusCode === 200) {
      console.log('-----转发返回的的数据-----', data)
      res.json(data)
    }
  }

  request(opt, callback)
})

module.exports = router
