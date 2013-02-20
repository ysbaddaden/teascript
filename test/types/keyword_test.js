var assert = require("assert");
var T = require("../../lib/tea");

exports.testNull = function () {
  assert.equal("null;", T.compile("null"));
};

exports.testBoolean = function () {
  assert.equal("true;",  T.compile("true"));
  assert.equal("false;", T.compile("false"));
};

exports.testKeyword = function () {
  assert.equal("continue;", T.compile("next"));
  assert.equal("continue;", T.compile("continue"));
  assert.equal("break;",    T.compile("break"));
};

if (module === require.main) {
  require("../test").run(exports);
}

