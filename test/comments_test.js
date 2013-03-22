var assert = require("assert");
var T = require("../lib/tea");

exports["test line comment"] = function () {
  assert.equal("", T.compile("# this is a comment"));
  assert.equal("var a;\na = 1;", T.compile("# this is a comment\na = 1"));
  assert.equal("var a;\na = 1;", T.compile("a = 1\n# this is a comment"));
  assert.equal("var a;\na = 1;", T.compile("a = 1 # this is a comment"));
  assert.equal("var a, b;\na = 1;\nb = c;", T.compile("a = 1 # this is a comment\n\nb=c"));
};

exports["test more comments"] = function () {
  assert.equal("A.extend();",
    T.compile(
        "A.extend(\n" +
        "  #sub: -> {\n" +
        "  #   \n" +
        "  #}\n" +
        ")"));
};

if (module === require.main) {
  require("./test").run(exports);
}

