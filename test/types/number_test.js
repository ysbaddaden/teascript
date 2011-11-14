var assert = require("assert");
var T = require("../../lib/tea");

exports.testInteger = function () {
  assert.equal("1;", T.toJavaScript("1"));
  assert.equal("2;", T.toJavaScript("2"));
  assert.equal("10931073019891;",  T.toJavaScript("10931073019891"));
}

exports.testFloat = function () {
  assert.equal("1.5;", T.toJavaScript("1.5"));
  assert.equal("0.125;", T.toJavaScript(".125"));
  assert.equal("2.109201;", T.toJavaScript("2.109201"));
  assert.equal("109310730.19891;", T.toJavaScript("109310730.19891"));
}

exports.testTildes = function () {
  assert.equal("~5;", T.toJavaScript("~5"));
  assert.equal("~2.109201;", T.toJavaScript("~2.109201"));
}

exports.testMinus = function () {
  assert.equal("~5;", T.toJavaScript("~5"));
  assert.equal("~2.109201;", T.toJavaScript("~2.109201"));
}

exports.testPlus = function () {
  assert.equal("-5;", T.toJavaScript("-5"));
  assert.equal("+2.109201;", T.toJavaScript("+2.109201"));
  assert.equal("-2.109201;", T.toJavaScript("-2.109201"));
}

exports.testExponential = function () {
  assert.equal("-5e10;", T.toJavaScript("-5e10"));
  assert.equal("+2.109201e-4;", T.toJavaScript("+2.109201e-4"));
  assert.equal("-2.109201e+126;", T.toJavaScript("-2.109201e+126"));
}

if (module === require.main) {
  require("../test").run(exports);
}

