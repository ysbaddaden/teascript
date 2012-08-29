var assert = require("assert");
var T = require("../../lib/tea");

exports.testExclusiveSlice = function () {
  assert.equal("Array.prototype.slice.call([1, 2, 3], 1, 4);",
    T.toJavaScript("[1, 2, 3][1...4]"));
  
  assert.equal("var ary;\nArray.prototype.slice.call(ary, 0, 4);",
    T.toJavaScript("ary[0...4]"));
  
  assert.equal("var ary;\nArray.prototype.slice.call(ary, 3, ary.length);",
    T.toJavaScript("ary[3...ary.length]"));
};

exports.testInclusiveSlice = function () {
  assert.equal("Array.prototype.slice.call([1, 2, 3], 1, 5);",
    T.toJavaScript("[1, 2, 3][1..4]"));
  
  assert.equal("var ary;\nArray.prototype.slice.call(ary, 0, 5);",
    T.toJavaScript("ary[0..4]"));
  
  assert.equal("var ary;\nArray.prototype.slice.call(ary, ary[0], ary.length + 1);",
    T.toJavaScript("ary[ary[0]..ary.length]"));
};

if (module === require.main) {
  require("../test").run(exports);
}

