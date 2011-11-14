var assert = require("assert");
var T = require("../../lib/tea");

exports.testDot = function () {
  assert.equal("var hsh;\nhsh.value;", T.toJavaScript("hsh.value"));
  assert.equal("var hsh;\nhsh.doSomething();", T.toJavaScript("hsh.doSomething()"));
}

if (module === require.main) {
  require("../test").run(exports);
}

