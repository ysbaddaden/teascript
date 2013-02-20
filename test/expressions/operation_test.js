var assert = require("assert");
var T = require("../../lib/tea");

exports.testAdditive = function () {
  assert.equal("a + 1;", T.compile("a + 1"));
  assert.equal("a + 1;", T.compile("a +\n1"));
  assert.equal("a - 1;", T.compile("a - 1"));
  assert.equal("a - 1;", T.compile("a -\n1"));
};

exports.testMultiplicative = function () {
  assert.equal("a * 1;", T.compile("a * 1"));
  assert.equal("a * 1;", T.compile("a *\n1"));
  assert.equal("a / 1;", T.compile("a / 1"));
  assert.equal("a / 1;", T.compile("a /\n1"));
  assert.equal("a % 1;", T.compile("a % 1"));
  assert.equal("a % 1;", T.compile("a %\n1"));
};

exports.testShift = function () {
  assert.equal("a >> 1;", T.compile("a >> 1"));
  assert.equal("a >> 1;", T.compile("a >>\n1"));
  assert.equal("a << 1;", T.compile("a << 1"));
  assert.equal("a << 1;", T.compile("a <<\n1"));
};

exports.testRelational = function () {
  assert.equal("a < 1;",  T.compile("a < 1"));
  assert.equal("a < 1;",  T.compile("a <\n1"));
  assert.equal("a > 1;",  T.compile("a > 1"));
  assert.equal("a > 1;",  T.compile("a >\n1"));
  assert.equal("a <= 1;", T.compile("a <= 1"));
  assert.equal("a <= 1;", T.compile("a <=\n1"));
  assert.equal("a >= 1;", T.compile("a >= 1"));
  assert.equal("a >= 1;", T.compile("a >=\n1"));
};

exports.testEquality = function () {
  assert.equal("a === 1;", T.compile("a == 1"));
  assert.equal("a === 1;", T.compile("a ==\n1"));
  assert.equal("a !== 1;", T.compile("a != 1"));
  assert.equal("a !== 1;", T.compile("a !=\n1"));
};

exports.testBitwise = function () {
  assert.equal("a & 1;", T.compile("a & 1"));
  assert.equal("a | 1;", T.compile("a | 1"));
  assert.equal("a ^ 1;", T.compile("a ^ 1"));
};

exports.testLogical = function () {
  assert.equal("a && 1;", T.compile("a && 1"));
  assert.equal("a && 1;", T.compile("a and 1"));
  assert.equal("a || 1;", T.compile("a || 1"));
  assert.equal("a || 1;", T.compile("a or 1"));
};

exports.testConditional = function () {
  assert.equal("true === 1 ? 12 : 34;", T.compile("true == 1 ? 12 : 34"));
  assert.equal("(2 + 1 === 1 + 2) ? 12 : 34;",
    T.compile("(2 + 1 == 1 +\n2) ?\n12\n:\n34 \n"));
};

exports.testConditionalAssign = function () {
  assert.equal("if (!x) x = 1;", T.compile("x ||= 1"));
};

if (module === require.main) {
  require("../test").run(exports);
}
