var assert = require("assert");
var T = require("../../lib/tea");

exports.testAssignment = function () {
  [ "=", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", ">>=", "<<=" ].forEach(function (op) {
    assert.equal("var a;\na " + op + " 1;", T.toJavaScript("a " + op + " 1"));
    assert.equal("var a;\na " + op + " doSomething();", T.toJavaScript("a " + op + " doSomething()"));
    assert.equal("var a, x, y, z;\na " + op + " x + y + z;", T.toJavaScript("a " + op + " x + y + z"));
  });
}

if (module === require.main) {
  require("../test").run(exports);
}

