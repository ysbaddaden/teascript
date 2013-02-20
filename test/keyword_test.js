var assert = require("assert");
var T = require("../lib/tea");

exports['test nil keyword'] = function () {
  assert.equal("var x;\nx = null;", T.compile("x = nil"));
};

exports['test nil keyword in compares'] = function () {
  assert.equal("var pos;\npos = ref == null ? 'left' : 'right';",
    T.compile("pos = ref == nil ? 'left' : 'right'"));
  assert.equal("var counter;\nif (counter == null) {\n    counter = 1;\n}",
    T.compile("counter = 1 if counter == nil"));
};

if (module === require.main) {
  require("./test").run(exports);
}

