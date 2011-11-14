var assert = require("assert");
var T = require("../../lib/tea");

exports.testIndex = function () {
  assert.equal("var ary;\nary[1];", T.toJavaScript("ary[1]"));
  
  assert.equal("var ary;\nary[ary.length - 1];",
    T.toJavaScript("ary[ary.length - 1]"));
  
  assert.equal("var ary;\nary[ary.lastIndex() - 3];",
    T.toJavaScript("ary[ary.lastIndex() - 3]"));
  
  assert.equal("var some;\nsome.call()[0];", T.toJavaScript("some.call()[0]"));
}

if (module === require.main) {
  require("../test").run(exports);
}
