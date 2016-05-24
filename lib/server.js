const http = require('http');
const domain = require('domain');

module.exports = function(app, options, debug) {
  app.listen = function listen(port, cb) {
    port = port || process.env.PORT || '9030';
    cb = cb || function() {
      debug('%s: HTTP Server running on %s...', app.env, port);
    };

    const fn = app.callback();
    const serverDomain = domain.create();

    serverDomain.run(function() {
      const server = http.createServer(function(req, res) {
        const reqd = domain.create();
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
  };
};
