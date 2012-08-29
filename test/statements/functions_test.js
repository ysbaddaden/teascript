var assert = require("assert");
var T = require("../../lib/tea");

exports.testEmptyFunctionStatement = function () {
  assert.equal("function fn() {\n}", T.toJavaScript("def fn\nend"));
  assert.equal("function fn() {\n}", T.toJavaScript("def fn()\nend"));
  assert.equal("function test(a) {\n}", T.toJavaScript("def test(a);end"));
};

exports.testArguments = function () {
  assert.equal("function test(a) {\n}", T.toJavaScript("def test(a);end"));
  assert.equal("function test(b) {\n}", T.toJavaScript("def test b;end"));
  assert.equal("function test(a, b, c, d) {\n}", T.toJavaScript("def test a, b, c, d;end"));
};

exports.testDefaultArguments = function () {
  assert.equal('function test(a) {\n' +
               '    if (typeof a === \'undefined\') {\n' +
               '        a = "str";\n' +
               '    }\n' +
               '}',
               T.toJavaScript('def test(a = "str");end'));

  assert.equal('function test(a, b) {\n' +
               '    if (typeof b === \'undefined\') {\n' +
               '        b = "str";\n' +
               '    }\n' +
               '}',
               T.toJavaScript('def test(a, b = "str");end'));

  assert.equal('function test(a, b) {\n' +
               '    if (typeof a === \'undefined\') {\n' +
               '        a = "test";\n' +
               '    }\n' +
               '    if (typeof b === \'undefined\') {\n' +
               '        b = "suite";\n' +
               '    }\n' +
               '}',
               T.toJavaScript('def test(a = "test", b = "suite");end'));
};

exports.testSplatArguments = function () {
  assert.equal('function sendTo() {\n' +
               '    var emails = Array.prototype.slice.call(arguments, 0) || [];\n' +
               '}',
               T.toJavaScript('def sendTo(*emails);end'));

  assert.equal('function send(from) {\n' +
               '    var to = Array.prototype.slice.call(arguments, 1) || [];\n' +
               '}',
               T.toJavaScript('def send(from, *to)\nend'));

  assert.equal('function send(from) {\n' +
               '    if (typeof from === \'undefined\') {\n' +
               '        from = Config.default_from;\n' +
               '    }\n' +
               '    var to = Array.prototype.slice.call(arguments, 1) || [];\n' +
               '}',
               T.toJavaScript('def send(from = Config.default_from, *to)\nend'));
};

exports.testEmptyLambda = function () {
  assert.equal("function () {\n}", T.toJavaScript("->() {}"));
  assert.equal("function () {\n}", T.toJavaScript("->()\n{\n}"));
  assert.equal("function () {\n}", T.toJavaScript("-> () {}"));
  assert.equal("function () {\n}", T.toJavaScript("-> ()\n{\n}"));
  assert.equal("function () {\n}", T.toJavaScript("-> {}"));
  assert.equal("function () {\n}", T.toJavaScript("->\n{\n}"));
};

exports.testEmptyLambdaWithArguments = function () {
  assert.equal('function (a, b, c, d) {\n}',
               T.toJavaScript('->(a, b, c, d) {\n}'));

  assert.equal('function () {\n' +
               '    var emails = Array.prototype.slice.call(arguments, 0) || [];\n' +
               '}',
               T.toJavaScript('->(*emails) {\n}'));
};

exports.testLambdaWithStatement = function () {
  assert.equal('function () {\n' +
               '    return "something";\n' +
               '}',
               T.toJavaScript('-> { return "something"; }')
  );
  assert.equal('function () {\n' +
               '    return "something";\n' +
               '}',
               T.toJavaScript('->(\n) { return "something"; }')
  );
  assert.equal('function (x, y) {\n' +
               '    return x + y;\n' +
               '}',
               T.toJavaScript('->(x, y) { return x + y; }')
  );
};

exports.testLambdaWithBody = function () {
  assert.equal('var obj;\n' +
               'obj = require("graphics");\n' +
               'function () {\n' +
               '    var x, y;\n' +
               '    x = obj.getX();\n' +
               '    y = obj.getY();\n' +
               '    return x + y;\n' +
               '}',
               T.toJavaScript('obj = require("graphics")\n' +
                              '-> {\n  x = obj.getX()\n  y = obj.getY()\n  return x + y\n}')
  );
  assert.equal('var obj;\n' +
               'obj = require("graphics");\n' +
               'function () {\n' +
               '    var x, y;\n' +
               '    x = obj.getX();\n' +
               '    y = obj.getY();\n' +
               '    return x + y;\n' +
               '}',
               T.toJavaScript('obj = require("graphics")\n' +
                              '->() {\n  x = obj.getX()\n  y = obj.getY()\n  return x + y\n}')
  );
  assert.equal('var obj;\n' +
               'obj = require("graphics");\n' +
               'function (x) {\n' +
               '    var y;\n' +
               '    y = obj.getY();\n' +
               '    return x + y;\n' +
               '}',
               T.toJavaScript('obj = require("graphics")\n' +
                              '->(x) {\n  y = obj.getY()\n  return x + y\n}')
  );
};

if (module === require.main) {
  require("../test").run(exports);
}
