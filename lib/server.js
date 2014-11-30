var http = require('http');
var domain = require('domain');

module.exports = function(app, options, debug) {
  options = options || {};

  app.listen = function listen(port, cb, onException) {
    port = port || options.port || process.env.PORT || '9030';
    cb = cb || function server() {
      debug('%s: HTTP Server running on %s...', app.env, port);
    };
    onException = onException || function (err) {
      if (/production/i.test(app.env)) {
        console.error('Error uncaughtException', '\n', err.message, '\n', err.stack);
        return;
      }
      throw err;
    };

    var fn = app.callback();
    var serverDomain = domain.create();

    serverDomain.run(function() {
      var server = http.createServer(function(req, res) {
        var reqd = domain.create();
        reqd.add(req);
        reqd.add(res);
        reqd.on('error', function(er) {
          console.error('Error', er, req.url);
          try {
            res.writeHead(500);
            res.end('Service temporarily unavailable.');
          } catch (er) {
            console.error('Error when sending 500', er, req.url);
          }
        });
      });
      server.on('request', fn);
      server.on('checkContinue', function checkContinue(req, res) {
        req.checkContinue = true;
        fn(req, res);
      });

      server.listen(port, cb);
    });

    process.on('uncaughtException', onException);
  };
};
