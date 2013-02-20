var assert = require("assert");
var T = require("../../lib/tea");

exports.testDot = function () {
  assert.equal("hsh.value;", T.compile("hsh.value"));
  assert.equal("hsh.doSomething();", T.compile("hsh.doSomething()"));
  assert.equal("document.body.getElementById('header');", T.compile("document.body.getElementById('header')"));
};

exports.testDotFromArray = function () {
  assert.equal("[].slice.call(list, 1, 3);", T.compile("[].slice.call(list, 1, 3)"));
};
exports.testDotFromObject = function () {
  assert.equal("{}.hasOwnProperty.call(obj, 'name');", T.compile("{}.hasOwnProperty.call(obj, 'name')"));
};

if (module === require.main) {
  require("../test").run(exports);
}

