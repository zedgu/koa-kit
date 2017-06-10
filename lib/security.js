module.exports = function (app, options, debug) {
  const xs = {};
  const ss = {};

  if (options.xss !== false) {
    xs['X-XSS-Protection'] = options.xss || '1; mode=block';
    debug('header `%s` added', 'X-XSS-Protection');
  }
  if (options.xframe !== false) {
    xs['X-Frame-Options'] = options.xframe || 'SAMEORIGIN';
    debug('header `%s` added', 'X-Frame-Options');
  }

  if (options.xtype !== false) {
    ss['X-Content-Type-Options'] = 'nosniff';
    debug('header `%s` added', 'X-Content-Type-Options');
  }
  if (options.hsts !== false) {
    ss['Strict-Transport-Security'] = options.hsts || 'max-age=7776000; includeSubDomains';
    debug('header `%s` added', 'Strict-Transport-Security');
  }

  if (options.csrf !== false) {
    const CSRF = require('koa-csrf');

    app.use(new CSRF(options.csrf));
    debug('`csrf` loaded.');
  }

  app.use(async function security(ctx, next) {
    await next();

    ctx.set(ss);
    if (/\/(html|xml)/.test(ctx.type)) {
      ctx.set(xs);
    }
  });
};