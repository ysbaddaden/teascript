var assert = require("assert");
var T = require("../../lib/tea");

exports.testAdditive = function () {
  assert.equal("var a;\na + 1;", T.toJavaScript("a + 1"));
  assert.equal("var a;\na + 1;", T.toJavaScript("a +\n1"));
  assert.equal("var a;\na - 1;", T.toJavaScript("a - 1"));
  assert.equal("var a;\na - 1;", T.toJavaScript("a -\n1"));
}

exports.testMultiplicative = function () {
  assert.equal("var a;\na * 1;", T.toJavaScript("a * 1"));
  assert.equal("var a;\na * 1;", T.toJavaScript("a *\n1"));
  assert.equal("var a;\na / 1;", T.toJavaScript("a / 1"));
  assert.equal("var a;\na / 1;", T.toJavaScript("a /\n1"));
  assert.equal("var a;\na % 1;", T.toJavaScript("a % 1"));
  assert.equal("var a;\na % 1;", T.toJavaScript("a %\n1"));
}

exports.testShift = function () {
  assert.equal("var a;\na >> 1;", T.toJavaScript("a >> 1"));
  assert.equal("var a;\na >> 1;", T.toJavaScript("a >>\n1"));
  assert.equal("var a;\na << 1;", T.toJavaScript("a << 1"));
  assert.equal("var a;\na << 1;", T.toJavaScript("a <<\n1"));
}

exports.testRelational = function () {
  assert.equal("var a;\na < 1;",  T.toJavaScript("a < 1"));
  assert.equal("var a;\na < 1;",  T.toJavaScript("a <\n1"));
  assert.equal("var a;\na > 1;",  T.toJavaScript("a > 1"));
  assert.equal("var a;\na > 1;",  T.toJavaScript("a >\n1"));
  assert.equal("var a;\na <= 1;", T.toJavaScript("a <= 1"));
  assert.equal("var a;\na <= 1;", T.toJavaScript("a <=\n1"));
  assert.equal("var a;\na >= 1;", T.toJavaScript("a >= 1"));
  assert.equal("var a;\na >= 1;", T.toJavaScript("a >=\n1"));
}

exports.testEquality = function () {
  assert.equal("var a;\na === 1;", T.toJavaScript("a == 1"));
  assert.equal("var a;\na === 1;", T.toJavaScript("a ==\n1"));
  assert.equal("var a;\na !== 1;", T.toJavaScript("a != 1"));
  assert.equal("var a;\na !== 1;", T.toJavaScript("a !=\n1"));
}

exports.testBitwise = function () {
  assert.equal("var a;\na & 1;", T.toJavaScript("a & 1"));
  assert.equal("var a;\na | 1;", T.toJavaScript("a | 1"));
  assert.equal("var a;\na ^ 1;", T.toJavaScript("a ^ 1"));
}

exports.testLogical = function () {
  assert.equal("var a;\na && 1;", T.toJavaScript("a && 1"));
  assert.equal("var a;\na && 1;", T.toJavaScript("a and 1"));
  assert.equal("var a;\na || 1;", T.toJavaScript("a || 1"));
  assert.equal("var a;\na || 1;", T.toJavaScript("a or 1"));
}

exports.testConditional = function () {
  assert.equal("true === 1 ? 12 : 34;", T.toJavaScript("true == 1 ? 12 : 34"));
  assert.equal("(2 + 1 === 1 + 2) ? 12 : 34;",
    T.toJavaScript("(2 + 1 == 1 +\n2) ?\n12\n:\n34 \n"));
}

if (module === require.main) {
  require("../test").run(exports);
}
