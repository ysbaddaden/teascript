var assert = require("assert");
var T = require("../../lib/tea");

exports.testDot = function () {
  assert.equal("hsh.value;", T.toJavaScript("hsh.value"));
  assert.equal("hsh.doSomething();", T.toJavaScript("hsh.doSomething()"));
};

if (module === require.main) {
  require("../test").run(exports);
}

