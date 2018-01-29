/**
 * Created by Wesdint on 2017/7/10.
 */
var express = require('express')
var router = express.Router()
var request = require('request')
var md5 = require('md5')

// sfa平台接口公参
const APP_PROP_CLIENT = 'wx'
const APP_PROP_CUID = 'abc'
const APP_PROP_VERSION = '1.0.0'
const APP_PROP_FORMAT = 'json'
const APP_PROP_SECRET = 'Er78s1hcT4Tyoaj2'

router.post('/region', (req, res) => {
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
      res.json(data)
    }
  }
  request(opt, callback)
})

router.post('/getSfaInfo', (req, res) => {
  let time = Date.now()
  let sign = md5(APP_PROP_SECRET + APP_PROP_CLIENT + APP_PROP_CUID + APP_PROP_FORMAT + time + APP_PROP_VERSION + APP_PROP_SECRET)
  let query = '?client=' + APP_PROP_CLIENT + '&cuid=' + APP_PROP_CUID + '&format=' + APP_PROP_FORMAT + '&time=' + time + '&version=' + APP_PROP_VERSION + '&sign=' + sign
  let proxyUrl = ''
  if (process.env.NODE_ENV === 'production') {
    proxyUrl = 'http://bmcrm.bluemoon.com.cn/bmcrm-control//user/getUserInfo' + query
  } else if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'localhost') {
    proxyUrl = 'http://tmallapi.bluemoon.com.cn/bmcrm-control//user/getUserInfo' + query
  }
  let httpMethod = req.method.toUpperCase()
  let opt = {
    headers: {'Connection': 'close'},
    url: proxyUrl,
    method: httpMethod,
    json: true,
    body: req.body
  }

  let callback = (error, response, data) => {
    if (!error && response.statusCode === 200) {
      res.json(data)
    }
  }
  request(opt, callback)
})
module.exports = router
