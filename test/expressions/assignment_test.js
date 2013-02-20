var assert = require("assert");
var T = require("../../lib/tea");

exports["test ="] = function () {
  assert.equal("var a;\na = 1;", T.compile("a = 1"));
  assert.equal("var a;\na = 12.129;", T.compile("a =\n12.129"));
  assert.equal("var a;\na = doSomething();", T.compile("a = doSomething()"));
  assert.equal("var a;\na = x + y + z;", T.compile("a = x + y + z"));
};

[ "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", ">>=", "<<=" ].forEach(function (op) {
  exports["test " + op] = function () {
    assert.equal("a " + op + " 1;", T.compile("a " + op + " 1"));
    assert.equal("a " + op + " 12.129;", T.compile("a " + op + "\n12.129"));
    assert.equal("a " + op + " doSomething();", T.compile("a " + op + " doSomething()"));
    assert.equal("a " + op + " x + y + z;", T.compile("a " + op + " x + y + z"));
  };
});

exports.testAssignmentChaining = function () {
  assert.equal("var a, b, c;\na = b = c = d * 4 + 3;", T.compile("a = b = c = d * 4 + 3"));
  assert.equal("var a, b, c;\na = b = c = d * 4 + 3;", T.compile("a =\nb =\nc =\nd * 4 +\n3"));
};

if (module === require.main) {
  require("../test").run(exports);
}

