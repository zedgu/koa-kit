koa-kit
=======

A simple framework with functional tools for koa.

[![NPM version][npm-image]][npm-url] 
[![build status][travis-image]][travis-url] 
[![Test coverage][coveralls-image]][coveralls-url]
[![NPM Monthly Downloads][npm-download]][npm-url]
[![Dependencies][david-image]][david-url]
[![License][license-image]][license-url]
[![Tips][tips-image]][tips-url]

Usage
-----

```js
const kk = require('koa-kit');
const app = kk();

app.listen();
```

Options
-------

```js
const app = kk({
  body: {formidable: {uploadDir: path.join(__dirname, '..', 'public/upload')}}, // <- by default, see https://github.com/dlau/koa-body
  error: undefined, // <- by default, see https://github.com/zedgu/koa-http-errors
  csrf: undefined, // <- by default, false for not setting, see https://github.com/pillarjs/csrf
  xss: '1; mode=block', // <- by default, false for not setting
  xtype: 'nosniff', // <- by default, false for not setting
  xframe: 'SAMEORIGIN', // <- by default, false for not setting
  hsts: false, // <- by default, true for set('Strict-Transport-Security', 'max-age=7776000; includeSubDomains'). But setting this in nginx is better.
  context: true, // <- by default, false for not using
  etag: true, // <- by default, false for not using
  logger: true, // <- by default, false for not using, only for 'development' env
  debug: 'koa:kit', // <- by default, name for debug (https://www.npmjs.com/package/debug)
  assertOK: 'assertOK', // <- by default, false for not using, see APIs - ctx.assertOK
  assertEqual: 'assertEqual' // <- by default, false for not using, see APIs - ctx.assertOK
  assertQuery: 'assertQuery' // <- by default, false for not using, see APIs - ctx.assertOK
});
```

APIs
----

### app.listen

####~~`app.listen([port], [callback], [onException]);`~~ Deprecated

* ~~port: 9030 by default, or set process.env.PORT~~;
* ~~callback: call by http.Server.listen~~;
* ~~onException: handler for Event: 'uncaughtException'~~.

####`app.listen();`

* Same as `koa.listen`;

### ctx.assertOK

####`ctx.assertOK(value[, statusCode][, statusMeassage][, errorProperties])`

Just like the ctx.assert, but throw error when `value instanceof Error`;

### ctx.assertEqual

####`ctx.assertEqual(actual, expected[, statusCode][, statusMeassage][, errorProperties])`

Throw `HTTPError` if `actual` is not match the type or value of `expected`.

* **actual**: required, throw error when it is undefined;
* **expected**:
  - *RegExp*
    + return expected.test(actual)
  - *Function*
    + return expected(actual);
    + *expected must return a Boolean.*
  - *Object*
    + Wrapper Object, check the type of the actual. (For example, `{userName: String, age: Number}`.)
    + Normal Object, deeply checking by `expected`. (For example, `{userName: 'abc', age: 18, address: /^No\./i}`.)

```js
var obj = {
  userName: 'abc',
  age: 18,
  address: 'No.123 xyz Road.'
};

this.assertEqual(obj.age, 19);
// => HTTPError, 18 != 19
this.assertEqual(obj.address, /^No\./i);
// => true, /^No\./i.test('No.123 xyz Road.')
this.assertEqual(obj, {userName: String, age: Number});
// => Do nothing, type matched.
// String, Number, Array, Object, Boolean, Function
this.assertEqual(obj, {userName: 'abc', age: '18', address: /^No\./i});
// => HTTPError, using Strict Equal, 18 !== '18'.
this.assertEqual(obj, {userName: 'abc', age: function (value){ return value > 17 && value < 25; }});
// => Do nothing, age function return true.
```

### ctx.assertQuery

####`ctx.assertQuery(actual, expected[, statusCode][, statusMeassage][, errorProperties])`

Almost the same as `ctx.assertEqual`, but:

* **actual**:
  - *undefined*
    + return HTTP 400 by default
* **expected**:
  - *String*
    + Tests required properties when actual is an object, property names should set off by ONE ` ` (space) . (For example, `"userName aget"`.)

```js
var obj = {
  userName: 'abc',
  age: 18,
  address: 'No.123 xyz Road.'
};

this.assertEqual(obj, 'userName age');
// => Do nothing.
this.assertEqual(obj, 'userName fullName');
// => HTTPError, fullName was missing.
```

[npm-image]: https://img.shields.io/npm/v/koa-kit.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-kit
[travis-image]: https://img.shields.io/travis/zedgu/koa-kit.svg?style=flat-square
[travis-url]: https://travis-ci.org/zedgu/koa-kit
[coveralls-image]: https://img.shields.io/coveralls/zedgu/koa-kit.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/zedgu/koa-kit?branch=master
[david-image]: http://img.shields.io/david/zedgu/koa-kit.svg?style=flat-square
[david-url]: https://david-dm.org/zedgu/koa-kit
[license-image]: http://img.shields.io/npm/l/koa-kit.svg?style=flat-square
[license-url]: https://github.com/zedgu/koa-kit/blob/master/LICENSE
[npm-download]: http://img.shields.io/npm/dm/koa-kit.svg?style=flat-square
[tips-image]: http://img.shields.io/gittip/zedgu.svg?style=flat-square
[tips-url]: https://www.gittip.com/zedgu/
