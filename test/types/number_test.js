var assert = require("assert");
var T = require("../../build/tea");

exports.testInteger = function () {
  assert.equal("1;", T.compile("1"));
  assert.equal("2;", T.compile("2"));
  assert.equal("10931073019891;",  T.compile("10931073019891"));
};

exports.testFloat = function () {
  assert.equal("1.5;", T.compile("1.5"));
  assert.equal("0.125;", T.compile(".125"));
  assert.equal("2.109201;", T.compile("2.109201"));
  assert.equal("109310730.19891;", T.compile("109310730.19891"));
};

exports.testExponential = function () {
  assert.equal("-5e10;", T.compile("-5e10"));
  assert.equal("+2.109201e-4;", T.compile("+2.109201e-4"));
  assert.equal("-2.109201e+126;", T.compile("-2.109201e+126"));
};

if (module === require.main) {
  require("../test").run(exports);
}

