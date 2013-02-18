var assert = require("assert");
var T = require("../../build/tea");

exports.testNewExpression = function () {
  assert.equal("new Object();", T.compile("new Object()"));
  assert.equal("new Object();", T.compile("new Object"));
  assert.equal("new Object(arg1, arg2);", T.compile("new Object(arg1, arg2)"));
};

exports.testWithExpressions = function () {
  assert.equal("new A.B.C.D();",    T.compile("new A.B.C.D"));
  assert.equal("new coll[name]();", T.compile("new coll[name]"));
  //assert.equal("new (new A.B.C())();", T.compile("new (A.B.C.new)"));
};

exports.testWithArguments = function () {
  assert.equal("new A(arg1, arg2);",  T.compile("new A(arg1, arg2)"));
  assert.equal("new A().init(arg);",  T.compile("new A().init(arg)"));
  assert.equal("new A.init(arg);",    T.compile("new A.init(arg)"));
  assert.equal("var a;\na = (new A()).init(arg1, arg2);",
      T.compile("a = (new A).init(arg1, arg2)"));
};

exports.testWithSplatArguments = function () {
  assert.equal("(function (fn, args, ctor) {\n" +
               "    ctor.constructor = fn.constructor;\n" +
               "    var child = new ctor(),\n" +
               "        result = fn.apply(child, args),\n" +
               "        t = typeof result;\n" +
               "    return (t == 'object' || t == 'function') result || child: child;\n" +
               "}(Map, [].concat(args), function () {}));",
      T.compile("new Map(*args)"));

  assert.equal("(function (fn, args, ctor) {\n" +
               "    ctor.constructor = fn.constructor;\n" +
               "    var child = new ctor(),\n" +
               "        result = fn.apply(child, args),\n" +
               "        t = typeof result;\n" +
               "    return (t == 'object' || t == 'function') result || child: child;\n" +
               "}(Map, [].concat(ary1, ary2, [argn]), function () {}));",
      T.compile("new Map(*ary1, *ary2, argn)"));
};

if (module === require.main) {
  require("../test").run(exports);
}
