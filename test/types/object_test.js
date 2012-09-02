var assert = require("assert");
var T = require("../../lib/tea");

exports.testEmptyDeclaration = function () {
  assert.equal("{};", T.toJavaScript("{}"));
  assert.equal("{};", T.toJavaScript(" { \n } "));
};

exports.testDeclaration = function () {
  assert.equal("{\n    a: 1,\n    b: 2\n};", T.toJavaScript("{a:1,b:2}"));
  assert.equal("{\n    (a + b): 1,\n    c: 2\n};", T.toJavaScript("{(a+b):1,c:2}"));
  assert.equal("{\n    x: c.x,\n    y: c.y,\n    z: c.z\n};",
    T.toJavaScript(" { \nx:\n c.x,\n y:\n c.y\n,\n z:\n c.z\n } "));
};

exports.testOptionalLeadingComma = function () {
  assert.equal("{\n    A: 1\n};", T.toJavaScript("{ A: 1, }"));
  assert.equal("{\n    A: x()\n};", T.toJavaScript("{ A: x()\n  ,\n }"));
};

if (module === require.main) {
  require("../test").run(exports);
}

