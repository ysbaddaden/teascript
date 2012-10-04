var assert = require("assert");
var T = require("../../lib/tea");

exports.testDelete = function () {
  assert.equal("delete a;", T.toJavaScript("delete a"));
  assert.equal("delete window.someVariable;", T.toJavaScript("delete window.someVariable"));
};

if (module === require.main) {
  require("../test").run(exports);
}
