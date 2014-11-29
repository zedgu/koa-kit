var http = require('http');
var domain = require('domain');
var debug = require('debug')('koa:kit');

module.exports = function(app, options) {
  options = options || {};
  var fn = app.callback();
  var serverDomain = domain.create();
  var port = options.port || '9030';

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

    server.listen(port, function server() {
      debug('%s: HTTP Server running on %s...', app.env, port);
    });
  });
  process.on('uncaughtException', function (err) {
    console.error('Error uncaughtException', err);
  });
};
