var assert = require("assert");
var T = require("../../lib/tea");

exports.testNot = function () {
  assert.equal("var bool;\nbool = !true;", T.toJavaScript("bool = !true"));
  assert.equal("var b;\nb = !doSomething();", T.toJavaScript("b = !doSomething()"));
}

exports.testTypeof = function () {
  assert.equal("var x;\ntypeof x;", T.toJavaScript("typeof x"));
  assert.equal("var type, x;\ntype = typeof x === 'undefined';", T.toJavaScript("type = typeof x == 'undefined'"));
}

if (module === require.main) {
  require("../test").run(exports);
}

