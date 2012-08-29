var assert = require("assert");
var T = require("../../lib/tea");

exports.testCall = function () {
  assert.equal("doSomething();", T.toJavaScript("doSomething()"));
  
  assert.equal("var hsh;\nhsh.doSomethingElse();",
    T.toJavaScript("hsh.doSomethingElse()"));
  
  assert.equal("var hsh;\nhsh[0].doSomethingElse();",
    T.toJavaScript("hsh[0].doSomethingElse()"));
};

exports.testCallArguments = function () {
  assert.equal("var xyz;\ncallMe(xyz);", T.toJavaScript("callMe(xyz)"));
  assert.equal("var xyz;\ncallMe(xyz);", T.toJavaScript("callMe(\nxyz\n)"));
  assert.equal("var a, b;\ncallMe(a, b);", T.toJavaScript("callMe(a, b)"));
  assert.equal("var a, b;\ncallMe(a, b, {\n    test: false\n});",
    T.toJavaScript("callMe(\na \n, \nb\n, { test: false}\n )"));
};

exports.testCallSplats = function () {
  assert.equal("var args;\nx.apply(null, args);", T.toJavaScript("x(*args)"));
  
  assert.equal("var a, args, b;\n" +
    "x.apply(null, Array.prototype.concat.call([a, b], args));",
    T.toJavaScript("x(a, b, *args)"));
  
  assert.equal("var a, args, b;\n" +
    "x.apply(null, Array.prototype.concat.call([a], args, [b]));",
    T.toJavaScript("x(a, *args, b)"));
  
  assert.equal("var a, arg, args;\n" +
    "x.apply(null, Array.prototype.concat.call([a], args, [arg + 3]));",
    T.toJavaScript("x(a, *args, arg + 3)"));
  
  assert.equal("var a, args;\n" +
    "x.apply(null, Array.prototype.concat.call([a], args, [\n    [1, 2]\n]));",
    T.toJavaScript("x(a, *args, [1, 2])"));
};

if (module === require.main) {
  require("../test").run(exports);
}
