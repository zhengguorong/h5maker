var errors = require('./components/errors')

module.exports = function (app) {
  app.use('/api/users', require('./api/user'));
  app.use('/api/pages', require('./api/pages'));
  app.use('/api/upload', require('./api/file'));
  app.use('/auth', require('./auth'))
  // 404错误处理
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // 前端页面渲染路由
  app.route('/perview/:id').get(require('./render/preview'))

  // 其他资源路由
  app.route('/*')
    .get((req, res) => {
      res.render('index')
    });
}
