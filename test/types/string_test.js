var assert = require("assert");
var T = require("../../lib/tea");

exports["test single quoted strings"] = function () {
  assert.equal("'this is a string';", T.compile("'this is a string'"));

  assert.equal("'\\n this is a string\\n  with linebreaks and leading spaces\\n  ';",
    T.compile("'\n this is a string\n  with linebreaks and leading spaces\n  '"));
};

exports["test double quoted strings"] = function () {
  assert.equal('"this is a string";', T.compile('"this is a string"'));

  assert.equal('"\\n this is a string\\n  with linebreaks and leading spaces\\n  ";',
    T.compile('"\n this is a string\n  with linebreaks and leading spaces\n  "'));
};

exports["test adding strings"] = function () {
  assert.equal('var space;\nspace = " ";\n"hello" + space + "world";',
    T.compile('space = " "; "hello" + space + "world"'));

  assert.equal('var space;\nspace = " ";\n"hello" + space + "world";',
    T.compile('space = " "\n"hello" +\nspace +\n"world"'));
};

exports["test interpolations for double quoted strings"] = function () {
  assert.equal('"hello " + (name) + "";', T.compile('"hello #{name}"'));
  assert.equal('"hello " + (title + name) + "";', T.compile('"hello #{title + name}"'));
};

exports["test no interpolations for single quoted string"] = function () {
  assert.equal("'hello #{name}';", T.compile("'hello #{name}'"));
};

if (module === require.main) {
  require("../test").run(exports);
}

