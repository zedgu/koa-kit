module.exports = function (app, options) {
  options = options || {};
  var def = {
    xss: '1; mode=block',
    nosniff: 'nosniff',
    xframe: 'SAMEORIGIN',
    hsts: '7776000'
  };

  for (var key in def) {
    switch(true) {
      case options[key] === false:
        this[key] = false;
        break;
      case !!options[key];
        this[key] = options[key];
        break;
      default:
        this[key] = def[key];
    }
    // this[key] = def[key];
    // if (options[key] === false) {
    //   this[key] = false;
    //   continue;
    // }
    // if (options[key]) {
    //   this[key] = options[key];
    // }
  }

  hsts = 'max-age=' + def.hsts;
  if (options.hstsSubDomains) {
    hsts += '; includeSubDomains';
  }

  app.use(function* security(next) {
    var set = this.response.set;

    if (hsts) {
      set('Strict-Transport-Security', hsts);
    }
    if (nosniff) {
      set('X-Content-Type-Options', nosniff);
    }
    yield* next;
    var type = type;
    if (type && (~type.indexOf('text/html') || ~type.indexOf('text/xml') || ~type.indexOf('application/xml'))) {
      if (xframe) {
        set('X-Frame-Options', xframe);
      }
      if (xss) {
        set('X-XSS-Protection', xss);
      }
    }
  });
};