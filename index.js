var koa = require('koa');
var debug = require('debug');

var libs = ['etag', 'security', 'server'];

module.exports = function kit(options) {
  options = options || {};

  var app = koa();
  app.env = process.env.NODE_ENV || 'development';

  require('koa-http-errors')(app, options.onerror);
  if (app.env === 'development') {
    app.use(require('koa-logger')(options.logger));
  }

  for (var i = libs.length - 1; i >= 0; i--) {
    if (options[libs[i]] !== false) {
      require('./lib/' + libs[i])(app, options[libs[i]], debug(options.debug || 'koa:kit'));
    }
  }

  require('koa-csrf')(app);

  var koaBody = options.body || {};
  koaBody.formidable = koaBody.formidable || {uploadDir: 'public'};
  app.use(require('koa-body')(koaBody));

  return app;
}