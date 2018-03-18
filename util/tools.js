/**
 * Created by zhengguorong on 2016/11/30.
 */
var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')
var ejs = require('ejs')
var fs = require('fs')
var puppeteer = require('puppeteer')

const base64ToImg = (imgData, filePath) => {
  var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "")
  var dataBuffer = new Buffer(base64Data, 'base64')
  var fileDir = path.dirname(filePath)
  mkdirp(fileDir, (err) => {
    if (err) throw new Error(err)
    fs.writeFile(filePath, dataBuffer, (err) => {
      if (err) throw new Error(err)
    })
  })
}
const renderFile = (filePath, data, successCallback) => {
  return new Promise((resolve, reject) => {
    var rootPath = path.join(__dirname, '../views/')
    fs.readFile(rootPath + filePath, { flag: 'r+', encoding: 'utf8' }, function (err, result) {
      if (err) {
        console.log(err)
        reject(err)
      }
      let html = ejs.render(result, data)
      resolve(html)
      successCallback && successCallback(html)
    })
  })
}
const saveFile = (filePath, data, type, successCallback) => {
  return new Promise((resolve, reject) => {
    var rootPath = ''
    if (type === 'QR') {
      rootPath = path.join(__dirname, '../public/QR/')
    } else {
      rootPath = path.join(__dirname, '../public/pages/')
    }
    mkdirp(rootPath, (err) => {
      if (err) {
        reject(err)
        return
      }
      fs.writeFile(rootPath + filePath, data, function (err) {
        if (err) {
          console.error(err)
          reject(err)
        } else {
          resolve()
          successCallback && successCallback()
        }
      })
    })
  })
}
const html2img = (url, filepath) => {
  puppeteer.launch().then(browser => {
    browser.newPage().then(page => {
      page.setViewport({
        width: 320,
        height: 568
      }).then(() => {
        page.goto(url).then(() => {
          // 访问页面链接的方式（page.goto()）有参数指定可等页面网络请求完成再进行下一步操作
          // 直接setContent的方式目前的方式是延时一秒再进行截图操作（可能有其他方法实现）
          setTimeout(() => {
            page.screenshot({path: filepath, fullPage: true}).then(() => {
              browser.close()
            })
          }, 1000)
        })
      })
    })
  })
}
module.exports = {
    base64ToImg,
    renderFile,
    saveFile,
    html2img
}
