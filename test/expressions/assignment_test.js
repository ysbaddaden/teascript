var assert = require("assert");
var T = require("../../lib/tea");

[ "=", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", ">>=", "<<=" ].forEach(function (op) {
  exports["test " + op] = function () {
    assert.equal("var a;\na " + op + " 1;", T.toJavaScript("a " + op + " 1"));
    assert.equal("var a;\na " + op + " 12.129;", T.toJavaScript("a " + op + "\n12.129"));
    assert.equal("var a;\na " + op + " doSomething();", T.toJavaScript("a " + op + " doSomething()"));
    assert.equal("var a, x, y, z;\na " + op + " x + y + z;", T.toJavaScript("a " + op + " x + y + z"));
  }
});

exports.testAssignmentChaining = function () {
  assert.equal("var a, b, c, d;\na = b = c = d * 4 + 3;", T.toJavaScript("a = b = c = d * 4 + 3"));
  assert.equal("var a, b, c, d;\na = b = c = d * 4 + 3;", T.toJavaScript("a =\nb =\nc =\nd * 4 +\n3"));
}

if (module === require.main) {
  require("../test").run(exports);
}

