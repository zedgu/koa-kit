'use strict';

const kk = require('../');
const agent = require('supertest');

async function html(ctx, next) {
  ctx.body = '<html></html>';
  await next();
}
// describe('app.listen', function() {
//   it('should listen 9030 port by default', function(done) {
//     const app = kk();
//     app.listen();
//     for (var key in app) {
//       console.log(app[key]);
//     }
//   });
// });
describe('configuration testing', function() {
  it('should get the headers by default', function(done) {
    const app = kk();
    const request = agent(app.callback());
    app.use(html);

    request
      .get('/')
      .set({
        Accept: 'text/html'
      })
      .expect(200)
      .end(function(err, res) {
        res.headers.should.have.properties('etag', 'x-xss-protection', 'x-frame-options', 'x-content-type-options', 'strict-transport-security');
        done();
      });
  });
  it('should not get the headers when the configuration value is false', function(done) {
    const app = kk({
      etag: false,
      xss: false,
      xframe: false,
      xtype: false,
      hsts: false
    });
    const request = agent(app.callback());
    app.use(html);

    request
      .get('/')
      .set({
        Accept: 'text/html'
      })
      .expect(200)
      .end(function(err, res) {
        res.headers.should.have.keys('content-type', 'content-length', 'date', 'connection');
        done();
      });
  });
  it('should no Koa-Kit context functions when the configuration value is false', function(done) {
    const app = kk({
      assertOK: false,
      assertEqual: false,
      assertQuery: false,
      csrf: false,
      body: false
    });
    const request = agent(app.callback());
    app.use(async function(ctx, next) {
      ctx.body = [ctx.assertOK, ctx.assertQuery, ctx.assertEqual, ctx.assertCSRF, ctx.request.body]
      ctx.body.should.eql([undefined, undefined, undefined, undefined, undefined]);
      await next();
    });

    request
      .post('/')
      .send({
        a: 'a'
      })
      .expect(200)
      .end(done);
  });
  it('should have koa-logger middleware when NODE_ENV = "development"', function(done) {
    process.env.NODE_ENV = 'development';
    const app = kk();
    const request = agent(app.callback());
    app.middleware[3].name.should.eql('logger');
    done();
  });
});