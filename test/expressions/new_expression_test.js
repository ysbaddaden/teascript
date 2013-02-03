var assert = require("assert");
var T = require("../../lib/tea");

exports.testNewExpression = function () {
  assert.equal("new Object();", T.toJavaScript("new Object()"));
  assert.equal("new Object();", T.toJavaScript("new Object"));
  assert.equal("new Object(arg1, arg2);", T.toJavaScript("new Object(arg1, arg2)"));
};

exports.testWithExpressions = function () {
  assert.equal("new A.B.C.D();",    T.toJavaScript("new A.B.C.D"));
  assert.equal("new coll[name]();", T.toJavaScript("new coll[name]"));
  //assert.equal("new (new A.B.C())();", T.toJavaScript("new (A.B.C.new)"));
};

exports.testWithArguments = function () {
  assert.equal("new A(arg1, arg2);",  T.toJavaScript("new A(arg1, arg2)"));
  assert.equal("new A().init(arg);",  T.toJavaScript("new A().init(arg)"));
  assert.equal("new A.init(arg);",    T.toJavaScript("new A.init(arg)"));
  assert.equal("var a;\na = (new A()).init(arg1, arg2);",
      T.toJavaScript("a = (new A).init(arg1, arg2)"));
};

exports.testWithSplatArguments = function () {
  assert.equal("(function (fn, args, ctor) {\n" +
               "    ctor.constructor = fn.constructor;\n" +
               "    var child = new ctor(),\n" +
               "        result = fn.apply(child, args),\n" +
               "        t = typeof result;\n" +
               "    return (t == 'object' || t == 'function') result || child: child;\n" +
               "}(Map, [].concat(args), function () {}));",
      T.toJavaScript("new Map(*args)"));
};

if (module === require.main) {
  require("../test").run(exports);
}
