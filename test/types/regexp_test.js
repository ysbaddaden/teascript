var assert = require("assert");
var T = require("../../lib/tea");

exports["test regexp literal"] = function () {
  assert.equal("//;", T.compile("//"));
  assert.equal("/foo/;", T.compile("/foo/"));
  assert.equal("var re;\nre = /foo|(bar|baz)/;", T.compile("re = /foo|(bar|baz)/"));
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

if (module === require.main) {
  require("../test").run(exports);
}
