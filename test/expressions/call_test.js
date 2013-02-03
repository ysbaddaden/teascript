var assert = require("assert");
var T = require("../../lib/tea");

exports['test empty calls'] = function () {
  assert.equal("doSomething();",            T.toJavaScript("doSomething()"));
  assert.equal("hsh.doSomethingElse();",    T.toJavaScript("hsh.doSomethingElse()"));
  assert.equal("hsh[0].doSomethingElse();", T.toJavaScript("hsh[0].doSomethingElse()"));
};

exports['test call with arguments'] = function () {
  assert.equal("callMe(xyz);", T.toJavaScript("callMe(xyz)"));
  assert.equal("callMe(xyz);", T.toJavaScript("callMe(\nxyz\n)"));
  assert.equal("callMe(a, b);", T.toJavaScript("callMe(a, b)"));
  assert.equal("callMe(a, b, {\n    test: false\n});",
    T.toJavaScript("callMe(\na \n, \nb\n, { test: false}\n )"));
};

exports['test call with splats'] = function () {
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

exports['test call with options hash'] = function () {
  assert.equal("model.set(attr, undefined, {\n    unset: true\n});",
      T.toJavaScript("model.set(attr, undefined, unset: true)"));

  assert.equal("model.clear({\n    silent: true\n});",
      T.toJavaScript("model.clear(silent: true)"));
};

exports['test call with revserved keywords'] = function () {
  assert.equal("req.delete('/posts/1.json');", T.toJavaScript("req.delete('/posts/1.json')"));
  assert.equal("req.loop(function () {});", T.toJavaScript("req.loop(-> {})"));
  assert.equal("req.next();", T.toJavaScript("req.next()"));
  assert.equal("req.object;", T.toJavaScript("req.object"));
  assert.equal("req.own;", T.toJavaScript("req.own"));
  assert.equal("req.then;", T.toJavaScript("req.then"));
  assert.equal("req.when;", T.toJavaScript("req.when"));
};

if (module === require.main) {
  require("../test").run(exports);
}
