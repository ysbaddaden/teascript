var assert = require("assert");
var T = require("../../lib/tea");

exports.testIndex = function () {
  assert.equal("ary[1];", T.toJavaScript("ary[1]"));
  
  assert.equal("ary[ary.length - 1];",
    T.toJavaScript("ary[ary.length - 1]"));
  
  assert.equal("ary[ary.lastIndex() - 3];",
    T.toJavaScript("ary[ary.lastIndex() - 3]"));
  
  assert.equal("some.call()[0];", T.toJavaScript("some.call()[0]"));
};

if (module === require.main) {
  require("../test").run(exports);
}
