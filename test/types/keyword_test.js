var assert = require("assert");
var T = require("../../lib/tea");

exports.testkeyword = function () {
  assert.equal("continue;", T.toJavaScript("next"));
  assert.equal("continue;", T.toJavaScript("continue"));
  assert.equal("break;", T.toJavaScript("break"));
}

if (module === require.main) {
  require("../test").run(exports);
}

