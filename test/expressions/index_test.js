var assert = require("assert");
var T = require("../../lib/tea");

exports.testIndex = function () {
  assert.equal("ary[1];", T.compile("ary[1]"));
  
  assert.equal("ary[ary.length - 1];",
    T.compile("ary[ary.length - 1]"));
  
  assert.equal("ary[ary.lastIndex() - 3];",
    T.compile("ary[ary.lastIndex() - 3]"));
  
  assert.equal("some.call()[0];", T.compile("some.call()[0]"));
};

if (module === require.main) {
  require("../test").run(exports);
}
