var etag = require('koa-etag');
var conditional = require('koa-conditional-get');

module.exports = function (app, options) {
  app.use(conditional());
  app.use(etag());
};