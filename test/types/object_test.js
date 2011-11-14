var assert = require("assert");
var T = require("../../lib/tea");

exports.testEmptyDeclaration = function () {
  assert.equal("{};", T.toJavaScript("{}"));
  assert.equal("{};", T.toJavaScript(" { \n } "));
}

exports.testDeclaration = function () {
  assert.equal("{ a: 1, b: 2 };", T.toJavaScript("{a:1,b:2}"));
  assert.equal("var a, b;\n{ (a + b): 1, c: 2 };", T.toJavaScript("{(a+b):1,c:2}"));
  assert.equal("var c;\n{ x: c.x, y: c.y, z: c.z };",
    T.toJavaScript(" { \nx:\n c.x,\n y:\n c.y\n,\n z:\n c.z\n } "));
}

exports.testOptionalLeadingComma = function () {
  assert.equal("{ A: 1 };", T.toJavaScript("{ A: 1, }"));
  assert.equal("{ A: x() };", T.toJavaScript("{ A: x()\n  ,\n }"));
}

if (module === require.main) {
  require("../test").run(exports);
}

