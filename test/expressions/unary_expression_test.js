var assert = require("assert");
var T = require("../../build/tea");

exports.testMinus = function () {
  assert.equal("-1;", T.compile("-1"));
  assert.equal("-doSomething();", T.compile("-doSomething()"));
  assert.equal("var x;\nx = -(e.pageX + div.scrollTop);",
      T.compile("x = -(e.pageX + div.scrollTop)"));
};

exports.testPlus = function () {
  assert.equal("+1;", T.compile("+1"));
  assert.equal("+doSomething();", T.compile("+doSomething()"));
};

exports.testTilde = function () {
  assert.equal("~1.5e10;", T.compile("~1.5e10"));
  assert.equal("~doSomething();", T.compile("~doSomething()"));
};

exports.testNot = function () {
  assert.equal("var bool;\nbool = !true;", T.compile("bool = !true"));
  assert.equal("var b;\nb = !doSomething();", T.compile("b = !doSomething()"));
};

exports.testTypeof = function () {
  assert.equal("typeof x;", T.compile("typeof x"));
  assert.equal("var type;\ntype = typeof x === 'undefined';", T.compile("type = typeof x == 'undefined'"));
};

if (module === require.main) {
  require("../test").run(exports);
}

