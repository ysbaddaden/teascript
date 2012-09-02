var assert = require("assert");
var T = require("../../lib/tea");

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

