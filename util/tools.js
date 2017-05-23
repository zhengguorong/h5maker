/**
 * Created by zhengguorong on 2016/11/30.
 */
var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')
var ejs = require('ejs')
var fs = require('fs')

const base64ToImg = (imgData, filePath) => {
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "")
    var dataBuffer = new Buffer(base64Data, 'base64')
    var fileDir = path.dirname(filePath)
    mkdirp(fileDir, (err) => {
        fs.writeFile(filePath, dataBuffer, (err) => {
        })
    })
}
const renderFile = (filePath, data, successCallback) => {
    var rootPath = path.join(__dirname, '../views/')
    fs.readFile(rootPath + filePath, { flag: 'r+', encoding: 'utf8' }, function (err, result) {
        if (err) {
            console.log(err)
            return;
        }
        let html = ejs.render(result, data)
        successCallback(html)
    });
}
const saveFile = (filePath, data, successCallback) => {
    var rootPath = path.join(__dirname, '../public/pages/')
    mkdirp(rootPath, (err) => {
        fs.writeFile(rootPath + filePath, data, function (err) {
            if (err) {
                console.error(err);
            } else {
                successCallback && successCallback()
            }
        });
    })

}

module.exports = {
    base64ToImg,
    renderFile,
    saveFile
}