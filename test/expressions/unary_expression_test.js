var assert = require("assert");
var T = require("../../lib/tea");

exports.testMinus = function () {
  assert.equal("-1;", T.toJavaScript("-1"));
  assert.equal("-doSomething();", T.toJavaScript("-doSomething()"));
  assert.equal("var x;\nx = -(e.pageX + div.scrollTop);",
      T.toJavaScript("x = -(e.pageX + div.scrollTop)"));
};

exports.testPlus = function () {
  assert.equal("+1;", T.toJavaScript("+1"));
  assert.equal("+doSomething();", T.toJavaScript("+doSomething()"));
};

exports.testTilde = function () {
  assert.equal("~1.5e10;", T.toJavaScript("~1.5e10"));
  assert.equal("~doSomething();", T.toJavaScript("~doSomething()"));
};

exports.testNot = function () {
  assert.equal("var bool;\nbool = !true;", T.toJavaScript("bool = !true"));
  assert.equal("var b;\nb = !doSomething();", T.toJavaScript("b = !doSomething()"));
};

exports.testTypeof = function () {
  assert.equal("typeof x;", T.toJavaScript("typeof x"));
  assert.equal("var type;\ntype = typeof x === 'undefined';", T.toJavaScript("type = typeof x == 'undefined'"));
};

if (module === require.main) {
  require("../test").run(exports);
}

