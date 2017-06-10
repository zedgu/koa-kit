'use strict';

const kk = require('../');
const agent = require('supertest');

const app = kk({csrf:false});
const request = agent(app.callback());

app.use(async function router(ctx, next) {
  const tests = {
    'Number': Number,
    'RegExp': /a[\w]{4}3/,
    'Function': function(actual) {
      return actual.length;
    },
    'object': {a: 'abc', b: {c: Object}}
  };
  const actual = ctx.request.body.actual;
  const object = ctx.request.body.object;
  const expected = object ? tests[object] : ctx.request.body.expected;
  const statusCode = ctx.request.body.statusCode;
  const statusMessage = ctx.request.body.statusMessage;
  const errorProperties = ctx.request.body.errorProperties;
  
  switch (ctx.path) {
    case '/ok':
      ctx.assertOK(actual === 'err' ? new Error() : actual);
      break;
    case '/equal':
      ctx.assertEqual(actual, expected, statusCode, statusMessage, errorProperties);
      break;
    case '/query':
      ctx.assertQuery(actual, expected, statusCode, statusMessage, errorProperties);
      break;
    case '/argument':
      ctx.assertQuery(actual);
      break;
  }

  ctx.body = 'ok';
  await next();
});
describe('ctx.assertOK', function() {
  it('pass the assertion when value is "OK"', function(done) {
    request
      .post('/ok')
      .send({
        actual: 1
      })
      .expect(200)
      .end(done);
  });
  it('throw error when value is not exist', function(done) {
    request
      .post('/ok')
      .expect(500)
      .end(done);
  });
  it('throw error when value is not "OK"', function(done) {
    request
      .post('/ok')
      .send({
        actual: ''
      })
      .expect(500)
      .end(done);
  });
  it('throw error when value is an error', function(done) {
    request
      .post('/ok')
      .send({
        actual: 'err'
      })
      .expect(500)
      .end(done);
  });
});
describe('ctx.assertEqual', function() {
  describe('normal value assertion', function() {
    it('throw error when actual is not exist', function(done) {
      request
        .post('/equal')
        .expect(500)
        .end(done);
    });
    it('throw error when expected is not exist', function(done) {
      request
        .post('/argument')
        .send({
          actual: 'abc'
        })
        .expect(500)
        .end(done);
    });
    it('pass the assertion when value is equal', function(done) {
      request
        .post('/equal')
        .send({
          actual: 'abc',
          expected: 'abc'
        })
        .expect(200)
        .end(done);
    });
    it('throw error when value is not equal', function(done) {
      request
        .post('/equal')
        .send({
          actual: 1,
          expected: 2
        })
        .expect(500)
        .end(done);
    });
    it('pass the assertion when type matches the expected', function(done) {
      request
        .post('/equal')
        .send({
          actual: 1,
          object: 'Number'
        })
        .expect(200)
        .end(done);
    });
    it('pass the assertion when string value matches the expected RegExp', function(done) {
      request
        .post('/equal')
        .send({
          actual: 'abc123',
          object: 'RegExp'
        })
        .expect(200)
        .end(done);
    });
    it('pass the assertion when string value matches the expected Function', function(done) {
      request
        .post('/equal')
        .send({
          actual: 'abc123',
          object: 'Function'
        })
        .expect(200)
        .end(done);
    });
  });
  describe('Object assertion', function() {
    it('pass the assertion when value is equal', function(done) {
      request
        .post('/equal')
        .send({
          actual: {a: 'abc', b: {c: {}}},
          object: 'object'
        })
        .expect(200)
        .end(done);
    });
    it('throw error when value is not equal', function(done) {
      request
        .post('/equal')
        .send({
          actual: {a: 'abc', b: {c: {}}},
          expected: {a: 'abc', b: 1}
        })
        .expect(500)
        .end(done);
    });
  });
});
describe('ctx.assertQuery', function() {
  it('throw 400 when actual is not exist', function(done) {
    request
      .post('/query')
      .expect(400)
      .end(done);
  });
  it('throw 400 when properties of actual is missed', function(done) {
    request
      .post('/query')
      .send({
        actual: {a: 1, b: 2},
        expected: 'a c'
      })
      .expect(400)
      .end(done);
  });
  it('pass the assertion when properties of actual match expected', function(done) {
    request
      .post('/query')
      .send({
        actual: {a: 1, b: 2, c: 3},
        expected: 'a c'
      })
      .expect(200)
      .end(done);
  });
  it('pass the assertion when actual matches the expected RegExp', function(done) {
    request
      .post('/query')
      .send({
        actual: 'abc123',
        object: 'RegExp'
      })
      .expect(200)
      .end(done);
  });
  it('pass the assertion when value is not equal', function(done) {
    request
      .post('/query')
      .send({
        actual: {a: 'abc', b: {c: {}}},
        expected: {a: 'abc', b: 1}
      })
      .expect(500)
      .end(done);
  });
});