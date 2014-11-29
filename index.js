var koa = require('koa');

module.exports = function kit(options) {
  options = options || {};

  var app = koa();

  app.env = process.env.NODE_ENV || 'development';
  if (app.env === 'development') {
    app.use(require('koa-logger')(options.logger));
  }

  if (options.dbug) {
    app.dbug = require('debug')(options.dbug);
  }

  for (var part in options) {
    if (options[part] !== false) {
      require('./lib/' + part)(app, options[part]);
    }
  }

  require('koa-csrf')(app);

  var koaBody = options.body || {};
  koaBody.formidable = koaBody.formidable || {uploadDir: 'public'};
  app.use(require('koa-body')(koaBody));

  if (options.server !== false) {
    require('./lib/server')(app, options.server);
  }

  return app;
}