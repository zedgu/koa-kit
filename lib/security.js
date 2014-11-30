module.exports = function (app, options) {
  options = options || {};
  var xss = options.xss === false ? false : options.xss || '1; mode=block';
  var nosniff = options.nosniff === false ? false : options.nosniff || 'nosniff';
  var xframe = options.xframe === false ? false : options.xframe || 'SAMEORIGIN';
  var hsts = options.hsts === false ? false : options.hsts || '7776000';

  hsts = 'max-age=' + hsts;
  if (options.hstsSubDomains) {
    hsts += '; includeSubDomains';
  }

  app.use(function* security(next) {
    if (hsts) {
      this.response.set('Strict-Transport-Security', hsts);
    }
    if (nosniff) {
      this.response.set('X-Content-Type-Options', nosniff);
    }
    yield* next;
    var type = type;
    if (type && (~type.indexOf('text/html') || ~type.indexOf('text/xml') || ~type.indexOf('application/xml'))) {
      if (xframe) {
        this.response.set('X-Frame-Options', xframe);
      }
      if (xss) {
        this.response.set('X-XSS-Protection', xss);
      }
    }
  });
};