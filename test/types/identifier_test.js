var assert = require("assert");
var T = require("../../lib/tea");

exports.testIdentifier = function () {
  assert.equal("var azerty;\nazerty;", T.toJavaScript("azerty"));
  assert.equal("var left, right;\nleft = right;", T.toJavaScript("left = right"));
}

if (module === require.main) {
  require("../test").run(exports);
}

