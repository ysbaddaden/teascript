var assert = require("assert");
var T = require("../../lib/tea");

exports.testCall = function () {
  assert.equal("doSomething();", T.toJavaScript("doSomething()"));
  
  assert.equal("hsh.doSomethingElse();",
    T.toJavaScript("hsh.doSomethingElse()"));
  
  assert.equal("hsh[0].doSomethingElse();",
    T.toJavaScript("hsh[0].doSomethingElse()"));
};

exports.testCallArguments = function () {
  assert.equal("callMe(xyz);", T.toJavaScript("callMe(xyz)"));
  assert.equal("callMe(xyz);", T.toJavaScript("callMe(\nxyz\n)"));
  assert.equal("callMe(a, b);", T.toJavaScript("callMe(a, b)"));
  assert.equal("callMe(a, b, {\n    test: false\n});",
    T.toJavaScript("callMe(\na \n, \nb\n, { test: false}\n )"));
};

exports.testCallSplats = function () {
  assert.equal("x.apply(null, args);", T.toJavaScript("x(*args)"));
  
  assert.equal("x.apply(null, Array.prototype.concat.call([a, b], args));",
    T.toJavaScript("x(a, b, *args)"));
  
  assert.equal("x.apply(null, Array.prototype.concat.call([a], args, [b]));",
    T.toJavaScript("x(a, *args, b)"));
  
  assert.equal("x.apply(null, Array.prototype.concat.call([a], args, [arg + 3]));",
    T.toJavaScript("x(a, *args, arg + 3)"));
  
  assert.equal("x.apply(null, Array.prototype.concat.call([a], args, [\n    [1, 2]\n]));",
    T.toJavaScript("x(a, *args, [1, 2])"));
};

if (module === require.main) {
  require("../test").run(exports);
}
