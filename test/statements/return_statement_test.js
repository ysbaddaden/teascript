var assert = require("assert");
var T = require("../../lib/tea");

exports["test empty return statement"] = function () {
  assert.equal("return;", T.compile("return"));
  assert.equal("return;", T.compile("return;"));
};

exports["test return statement with an argument"] = function () {
  assert.equal("return process;", T.compile("return process"));
  assert.equal("return argv[0];", T.compile("return argv[0];"));
};

if (module === require.main) {
  require("../test").run(exports);
}
