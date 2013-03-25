var assert = require("assert");
var T = require("../../lib/tea");

exports["test regexp literal"] = function () {
  assert.equal("//;", T.compile("//"));
  assert.equal("/foo/;", T.compile("/foo/"));
  assert.equal("/A-Z/;",   T.compile("/A-Z/"));
  assert.equal("/ A-Z/;",  T.compile("/ A-Z/"));
  assert.equal("/A-Z /;",  T.compile("/A-Z /"));
  assert.equal("/ A-Z /;", T.compile("/ A-Z /"));
  assert.equal("var re;\nre = /foo|(bar|baz)/;", T.compile("re = /foo|(bar|baz)/"));
  assert.equal("return /bar/;", T.compile("return /bar/"));
  assert.equal("if (/bar/.test('xyz')) {}", T.compile("if /bar/.test('xyz');end"));
  assert.equal("if (!/bar/.test('xyz')) {}", T.compile("if !/bar/.test('xyz');end"));
};

exports["test regexp literal with flag"] = function () {
  assert.equal("/foo/i;",    T.compile("/foo/i"));
  assert.equal("/foo/g;",    T.compile("/foo/g"));
  assert.equal("/foo/gimy;", T.compile("/foo/gimy"));
};

exports["test regexp literal with escaped slashes"] = function () {
  assert.equal("/^\\/$/;", T.compile('/^\\/$/'));
  assert.equal("/\\/root\\/sub\\/path\\//;", T.compile("/\\/root\\/sub\\/path\\//"));
};

exports["test divs shouldn't be considered regexp literals"] = function () {
  assert.equal("1 / 2 / 3;", T.compile('1 / 2 / 3'));
  assert.equal("1 / 2 / 3;", T.compile('1/2/3'));
  assert.equal("var div;\ndiv = a / b / c;", T.compile('div = a / b / c'));
  assert.equal("var div;\ndiv = a / b / c;", T.compile('div = a/b/c'));
};

if (module === require.main) {
  require("../test").run(exports);
}
