var assert = require("assert");
var T = require("../../lib/tea");

exports.testNewExpression = function () {
  assert.equal("new Object();", T.toJavaScript("Object.new()"));
  assert.equal("new Object();", T.toJavaScript("Object.new"));
  assert.equal("new Object(arg1, arg2);", T.toJavaScript("Object.new(arg1, arg2)"));
};

exports.testWithExpressions = function () {
  assert.equal("new A.B.C.D();",    T.toJavaScript("A.B.C.D.new"));
  assert.equal("new coll[name]();", T.toJavaScript("coll[name].new"));
  //assert.equal("new (new A.B.C())();", T.toJavaScript("new (A.B.C.new)"));
};

exports.testWithArguments = function () {
  assert.equal("new A(arg1, arg2);",  T.toJavaScript("A.new(arg1, arg2)"));
  assert.equal("new A.init(arg2);",   T.toJavaScript("A.new.init(arg2)"));
  assert.equal("new A().init(arg2);", T.toJavaScript("A.new().init(arg2)"));
};

exports.testWithSplatArguments = function () {
};

if (module === require.main) {
  require("../test").run(exports);
}
