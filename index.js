'use strict';

const koa = require('koa');
const debug = require('debug');


module.exports = function kit(options) {
  const libs = ['context', 'kits', 'security'];
  const app = koa();

  options = options || {};

  while(libs.length) {
    require('./lib/' + libs.shift())(app, options, debug(options.debug || 'koa:kit'));
  }

  return app;
}