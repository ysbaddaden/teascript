var assert = require("assert");
var T = require("../../lib/tea");

exports.testIdentifier = function () {
  assert.equal("azerty;", T.toJavaScript("azerty"));
  assert.equal("var left;\nleft = right;", T.toJavaScript("left = right"));
};

if (module === require.main) {
  require("../test").run(exports);
}

