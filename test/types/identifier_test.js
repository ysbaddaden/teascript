var assert = require("assert");
var T = require("../../build/tea");

exports.testIdentifier = function () {
  assert.equal("azerty;", T.compile("azerty"));
  assert.equal("var left;\nleft = right;", T.compile("left = right"));
};

if (module === require.main) {
  require("../test").run(exports);
}

