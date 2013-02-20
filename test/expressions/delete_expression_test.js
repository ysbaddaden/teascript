var assert = require("assert");
var T = require("../../lib/tea");

exports.testDelete = function () {
  assert.equal("delete a;", T.compile("delete a"));
  assert.equal("delete window.someVariable;", T.compile("delete window.someVariable"));
};

if (module === require.main) {
  require("../test").run(exports);
}
