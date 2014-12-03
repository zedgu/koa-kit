var assert = require('assert');
var statuses = require('statuses');

module.exports = function(app, options) {
  options = options || {};

  app.context.onerror = function(err){
    // don't do anything if there is no error.
    // this allows you to pass `this.onerror`
    // to node-style callbacks.
    if (null == err) return;

    assert(err instanceof Error, 'non-error thrown: ' + err);

    // delegate
    this.app.emit('error', err, this);

    // nothing we can do here other
    // than delegate to the app-level
    // handler and log.
    if (this.headerSent || !this.writable) {
      err.headerSent = true;
      return;
    }

    // unset all headers
    this.res._headers = {};

    // ENOENT support
    if ('ENOENT' == err.code) err.status = 404;

    if (options.render) {
      options.render.bind(this)(err);
    } else {
      if ('number' != typeof err.status || !statuses[err.status]) err.status = 500;

      // respond
      var code = statuses[err.status];
      var msg = err.expose ? err.message : code;

      this.status = err.status;

      if ('json' === this.accepts('text', 'json')) {
        this.type = 'json';
        this.body = JSON.stringify(this.body);
        this.length = Buffer.byteLength(this.body);
        this.res.end(this.body);
        return;
      }

      // force text/plain
      this.type = 'text';
      // default to 500
      this.length = Buffer.byteLength(msg);
      this.res.end(msg);
    }
  }
};