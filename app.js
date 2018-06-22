/**
 * Q&A
 * 如果导出或导入模块?
 *     因项目没有使用BABEL或者typescrip的转换工具,无法支持import/export的方式
 *     import/export在ES7才得到支持,就算node7也无法使用
 *     所以我们使用module.exports来导出require来导入
 */
var express = require('express')
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var ejs = require('ejs')
var config = require('./config')
var fileUpload = require('express-fileupload')
mongoose.Promise = require('bluebird')

mongoose.connect(config.mongo.uri, { user: config.mongo.user, pass: config.mongo.pass })
mongoose.connection.on('error', function (err) {
  console.error(`MongoDB connection error: ${err}`)
  process.exit(-1);
})
var app = express()

// view engine setup
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'hbs'

app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'))


app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.send(200); /让options请求快速返回/
  }
  else {
    next();
  }
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json({ 'limit': '20000kb' }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'webapp/dist')))
app.use(fileUpload())
require('./routers')(app)

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.send(err.message)
});

module.exports = app
