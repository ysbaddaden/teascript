var assert = require("assert");
var T = require("../../lib/tea");

exports.testExclusiveSlice = function () {
  assert.equal("Array.prototype.slice.call(ary, 0, 4);",
    T.compile("ary[0...4]"));

  assert.equal("Array.prototype.slice.call(ary, 3, ary.length);",
    T.compile("ary[3...ary.length]"));

  assert.equal("Array.prototype.slice.call([1, 2, 3], 1, 4);",
    T.compile("[1, 2, 3][1...4]"));
};

exports.testInclusiveSlice = function () {
  assert.equal("Array.prototype.slice.call(ary, 0, 5);",
    T.compile("ary[0..4]"));

  assert.equal("Array.prototype.slice.call(ary, ary[0], ary.length + 1);",
    T.compile("ary[ary[0]..ary.length]"));

  assert.equal("Array.prototype.slice.call([1, 2, 3], 1, 5);",
    T.compile("[1, 2, 3][1..4]"));
};

if (module === require.main) {
  require("../test").run(exports);
}

