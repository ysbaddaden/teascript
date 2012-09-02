var assert = require("assert");
var T = require("../../lib/tea");

exports.testNull = function () {
  assert.equal("null;", T.toJavaScript("null"));
};

exports.testBoolean = function () {
  assert.equal("true;",  T.toJavaScript("true"));
  assert.equal("false;", T.toJavaScript("false"));
};

exports.testKeyword = function () {
  assert.equal("continue;", T.toJavaScript("next"));
  assert.equal("continue;", T.toJavaScript("continue"));
  assert.equal("break;",    T.toJavaScript("break"));
};

if (module === require.main) {
  require("../test").run(exports);
}

