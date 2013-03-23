var assert = require("assert");
var T = require("../lib/tea");

exports['test nil keyword'] = function () {
  assert.equal("var x;\nx = null;", T.compile("x = nil"));
};

exports['test comparing with nil'] = function () {
  assert.equal("var a;\na = prompt('something');\nif (a == null) {}",
    T.compile("a = prompt('something')\nif a == nil;end"));

  assert.equal("var a;\na = prompt('something');\nif (null == a) {}",
    T.compile("a = prompt('something')\nif nil == a;end"));
};

exports['test comparing with nil must ensure variable is defined'] = function () {
  assert.equal("var counter;\nif (typeof counter === 'undefined' || counter === null) {\n    counter = 1;\n}",
    T.compile("counter = 1 if counter == nil"));

  assert.equal("var counter;\nif (typeof counter === 'undefined' || counter === null) {\n    counter = 1;\n}",
    T.compile("counter = 1 if nil == counter"));
};

exports['test comparing with nil in conditional expressions'] = function () {
  assert.equal("var pos;\npos = typeof ref === 'undefined' || ref === null ? 'left' : 'right';",
    T.compile("pos = nil == ref ? 'left' : 'right'"));
};

if (module === require.main) {
  require("./test").run(exports);
}

