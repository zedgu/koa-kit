const path = require('path');

module.exports = function (app, options, debug) {
  app.use(require('koa-http-errors')(options.error));
  if (options.etag !== false) {
    app.use(require('koa-conditional-get')());
    app.use(require('koa-etag')());
    debug('`etag` loaded.');
  }
  if (options.logger !== false && app.env === 'development') {
    app.use(require('koa-logger')());
    debug('`koa-logger` loaded.');
  }
  if (options.body !== false) {
    app.use(require('koa-body')(options.body || {formidable: {uploadDir: path.join(__dirname, '..', 'public/upload')}}));
    debug('`koa-body` loaded.');
  }
  if (options.session !== false) {
    app.use(require('koa-generic-session')());
    app.keys = options.session || ['kk-key'];
  }
};