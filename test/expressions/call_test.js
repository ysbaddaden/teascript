var assert = require("assert");
var T = require("../../lib/tea");

exports['test empty calls'] = function () {
  assert.equal("doSomething();",            T.compile("doSomething()"));
  assert.equal("hsh.doSomethingElse();",    T.compile("hsh.doSomethingElse()"));
  assert.equal("hsh[0].doSomethingElse();", T.compile("hsh[0].doSomethingElse()"));
};

exports['test call with arguments'] = function () {
  assert.equal("callMe(xyz);", T.compile("callMe(xyz)"));
  assert.equal("callMe(xyz);", T.compile("callMe(\nxyz\n)"));
  assert.equal("callMe(a, b);", T.compile("callMe(a, b)"));
  assert.equal("callMe(a, b, {\n    test: false\n});",
    T.compile("callMe(\na \n, \nb\n, { test: false}\n )"));
};

exports['test call with splats'] = function () {
  assert.equal("x.apply(null, args);", T.compile("x(*args)"));

  assert.equal("x.apply(null, Array.prototype.concat.call([a, b], args));",
    T.compile("x(a, b, *args)"));

  assert.equal("x.apply(null, Array.prototype.concat.call([a], args, [b]));",
    T.compile("x(a, *args, b)"));

  assert.equal("x.apply(null, Array.prototype.concat.call([a], args, [arg + 3]));",
    T.compile("x(a, *args, arg + 3)"));

  assert.equal("x.apply(null, Array.prototype.concat.call([a], args, [\n    [1, 2]\n]));",
    T.compile("x(a, *args, [1, 2])"));
};

exports['test call with options hash'] = function () {
  assert.equal("model.set(attr, undefined, {\n    unset: true\n});",
      T.compile("model.set(attr, undefined, unset: true)"));

  assert.equal("model.clear({\n    silent: true\n});",
      T.compile("model.clear(silent: true)"));
};

exports['test call with reserved keywords'] = function () {
  assert.equal("req.delete('/posts/1.json');", T.compile("req.delete('/posts/1.json')"));
  assert.equal("req.loop(function () {});", T.compile("req.loop(-> {})"));
  assert.equal("req.next();", T.compile("req.next()"));
  assert.equal("req.object;", T.compile("req.object"));
  assert.equal("req.own;", T.compile("req.own"));
  assert.equal("req.then;", T.compile("req.then"));
  assert.equal("req.when;", T.compile("req.when"));
};

if (module === require.main) {
  require("../test").run(exports);
}
