var assert = require("assert");
var T = require("../../lib/tea");

exports["test empty function statements"] = function () {
  assert.equal("function fn() {}", T.compile("def fn\nend"));
  assert.equal("function fn() {}", T.compile("def fn()\nend"));
};

exports["test function names as dot expressions"] = function () {
  assert.equal('exports.compile = function () {};', T.compile('def exports.compile;end'));
  assert.equal('a.b.c.d = function () {};', T.compile('def a.b.c.d;end'));
};

exports["test arguments"] = function () {
  assert.equal("function test(a) {}", T.compile("def test(a);end"));
  assert.equal("function test(b) {}", T.compile("def test b;end"));
  assert.equal("function test(a, b, c, d) {}", T.compile("def test a, b, c, d;end"));
  assert.equal("function test(key) {\n    key = 'val';\n}", T.compile("def test(key);key = 'val';end"));
};

exports['test default arguments'] = function () {
  assert.equal('function test(a) {\n' +
               '    if (a === undefined) a = "str";\n' +
               '}',
               T.compile('def test(a = "str");end'));

  assert.equal('function test(a, b) {\n' +
               '    if (b === undefined) b = "str";\n' +
               '}',
               T.compile('def test(a, b = "str");end'));

  assert.equal('function test(a, b) {\n' +
               '    if (a === undefined) a = "test";\n' +
               '    if (b === undefined) b = "suite";\n' +
               '}',
               T.compile('def test(a = "test", b = "suite");end'));

  assert.equal('function render(error, status) {\n' +
               '    if (status === undefined) status = error;\n' +
               '}',
               T.compile('def render(error, status = error);end'));
};

exports["test splat arguments"] = function () {
  assert.equal('function sendTo() {\n' +
               '    var emails = Array.prototype.slice.call(arguments, 0) || [];\n' +
               '}',
               T.compile('def sendTo(*emails);end'));

  assert.equal('function send(from) {\n' +
               '    var to = Array.prototype.slice.call(arguments, 1) || [];\n' +
               '}',
               T.compile('def send(from, *to)\nend'));

  assert.equal('function send(from) {\n' +
               '    if (from === undefined) from = Config.default_from;\n' +
               '    var to = Array.prototype.slice.call(arguments, 1) || [];\n' +
               '}',
               T.compile('def send(from = Config.default_from, *to)\nend'));
};

exports["test empty lambdas"] = function () {
  assert.equal("var l;\nl = function () {};", T.compile("l = ->() {}"));
  assert.equal("var l;\nl = function () {};", T.compile("l = ->() {\n}"));
  assert.equal("var l;\nl = function () {};", T.compile("l = -> (\n) {}"));
  assert.equal("var l;\nl = function () {};", T.compile("l = -> {}"));
};

exports["test empty lambdas with arguments"] = function () {
  assert.equal('var l;\nl = function (a, b, c, d) {};',
               T.compile('l = ->(a, b, c, d) {\n}'));

  assert.equal('var caller;\ncaller = function () {\n' +
               '    var emails = Array.prototype.slice.call(arguments, 0) || [];\n' +
               '};',
               T.compile('caller = ->(*emails) {\n}'));
};

exports["test lambda assignment"] = function () {
  assert.equal('var x;\nx = function () {\n' +
               '    return "something";\n' +
               '};',
               T.compile('x = -> { return "something"; }')
  );
  assert.equal('var x;\nx = function () {\n' +
               '    return "something";\n' +
               '};',
               T.compile('x = ->(\n) { return "something"; }')
  );
  assert.equal('var x;\nx = function (x, y) {\n' +
               '    return x + y;\n' +
               '};',
               T.compile('x = ->(x, y) { return x + y; }')
  );
};

exports["test lambda assignment with body"] = function () {
  assert.equal('var obj, resize;\n' +
               'obj = require("graphics");\n' +
               'resize = function () {\n' +
               '    var x, y;\n' +
               '    x = obj.getX();\n' +
               '    y = obj.getY();\n' +
               '    return x + y;\n' +
               '};',
               T.compile('obj = require("graphics")\n' +
                         'resize = -> {\n' +
                         '  x = obj.getX()\n' +
                         '  y = obj.getY()\n' +
                         '  return x + y\n' +
                         '}'));

  assert.equal('var obj, resize;\n' +
               'obj = require("graphics");\n' +
               'resize = function () {\n' +
               '    var x, y;\n' +
               '    x = obj.getX();\n' +
               '    y = obj.getY();\n' +
               '    return x + y;\n' +
               '};',
               T.compile('obj = require("graphics")\n' +
                         'resize = ->() {x = obj.getX(); y = obj.getY(); return x + y}')
  );
  assert.equal('var obj, resize;\n' +
               'obj = require("graphics");\n' +
               'resize = function (x) {\n' +
               '    var y;\n' +
               '    y = obj.getY();\n' +
               '    return x + y;\n' +
               '};',
               T.compile('obj = require("graphics")\n' +
                         'resize = ->(x) {\n  y = obj.getY()\n  return x + y\n}')
  );
};

if (module === require.main) {
  require("../test").run(exports);
}
