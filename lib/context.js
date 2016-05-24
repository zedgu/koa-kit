const contexts = ['assertOK', 'assertEqual', 'assertQuery'];

function toArray(args) {
  return args.length === 1 ? [args[0]] : Array.apply(null, args);
}

function match(actual, expected) {
  if (actual === undefined || expected === undefined) {
    this.throw.apply(this, args);
  }

  switch (expected.constructor.name) {
    case 'RegExp':
      return expected.test(actual);
    case 'Function':
      if (expected.name && expected.name !== 'Function') {
        return expected.name === actual.constructor.name;
      }
      return expected(actual);
    case 'Object':
      var deeper = false;
      for (var key in expected) {
        deeper = match(actual[key], expected[key]);
        if (!deeper) {
          return deeper;
        }
      }
      return deeper;
    default:
      return actual === expected;
  }
}

exports = module.exports = function(app, options, debug) {
  const context = app.context;

  for (var i = contexts.length - 1; i >= 0; i--) {
    if (options[contexts[i]] !== false) {
      context[options[contexts[i]] || contexts[i]] = exports[contexts[i]];
      debug('`%s` loaded', options[contexts[i]] || contexts[i]);
    }
  }
};

exports.assertOK = function assertOK(value, statusCode, statusMessage, errorProperties) {
  if (value instanceof Error) {
    throw Error;
  }

  this.assert.apply(this, arguments);
};

exports.assertEqual = function assertEqual(actual, expected, statusCode, statusMessage, errorProperties) {
  const args = toArray(arguments);
  args.splice(0, 2);

  args.unshift(match(actual, expected));
  this.assert.apply(this, args);
};

exports.assertQuery = function assertQuery(actual, expected, statusCode, statusMessage, errorProperties) {
  if (actual === undefined) {
    this.throw(statusCode || 400, errorProperties || {code: 'No Query'});
  }

  if (actual.constructor.name === 'Object' && typeof expected === 'string') {
    expected = expected.split(' ');
    for (var i = expected.length - 1; i >= 0; i--) {
      if (actual[expected[i]] === undefined) {
        this.throw(statusCode || 400, errorProperties || {code: expected[i] + ' is required'});
      }
    }
    return;
  }

  this.assertEqual.apply(this, arguments);
};