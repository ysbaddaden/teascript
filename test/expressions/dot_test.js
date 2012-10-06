var assert = require("assert");
var T = require("../../lib/tea");

exports.testDot = function () {
  assert.equal("hsh.value;", T.toJavaScript("hsh.value"));
  assert.equal("hsh.doSomething();", T.toJavaScript("hsh.doSomething()"));
  assert.equal("document.body.getElementById('header');", T.toJavaScript("document.body.getElementById('header')"));
};

exports.testDotFromArray = function () {
  assert.equal("[].slice.call(list, 1, 3);", T.toJavaScript("[].slice.call(list, 1, 3)"));
};
exports.testDotFromObject = function () {
  assert.equal("{}.hasOwnProperty.call(obj, 'name');", T.toJavaScript("{}.hasOwnProperty.call(obj, 'name')"));
};

if (module === require.main) {
  require("../test").run(exports);
}

