var assert = require("assert");
var T = require("../../lib/tea");

exports["test empty strings"] = function () {
  assert.equal('"";', T.compile('""'));
  assert.equal("'';", T.compile("''"));
};

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

exports["test escaped quotes"] = function () {
  assert.equal("'this is a \\'string\\'';", T.compile("'this is a \\'string\\''"));
  assert.equal('"this is a \\"string\\"";', T.compile('"this is a \\"string\\""'));
};

exports["test adding strings"] = function () {
  assert.equal('var space;\nspace = " ";\n"hello" + space + "world";',
      T.compile('space = " "; "hello" + space + "world"'));

  assert.equal('var space;\nspace = " ";\n"hello" + space + "world";',
      T.compile('space = " "\n"hello" +\nspace +\n"world"'));
};

exports["test interpolation for double quoted strings"] = function () {
  assert.equal('("hello " + (name));', T.compile('"hello #{name}"'));
  assert.equal('("hello " + (title) + " " + (name));', T.compile('"hello #{title} #{name}"'));
  assert.equal('("hello " + (title + name));', T.compile('"hello #{title + name}"'));
};

exports["test call method on interpolated string"] = function () {
  assert.equal('("hello " + (name)).slice(7);', T.compile('"hello #{name}".slice(7)'));
};

exports["test index on interpolated string"] = function () {
  assert.equal('("hello " + (name))[8];', T.compile('"hello #{name}"[8]'));
};

exports["test strings inside interpolation"] = function () {
  assert.equal('("hello " + (\'title\'));', T.compile('"hello #{\'title\'}"'));
  assert.equal('("hello " + ("title" + "name"));', T.compile('"hello #{"title" + "name"}"'));
};

exports["test no interpolation for single quoted string"] = function () {
  assert.equal("'hello #{name}';", T.compile("'hello #{name}'"));
};

exports["test string interpolation state must be popped"] = function () {
  assert.equal('function () {\n' +
      '    console.log(("download " + (code) + " into " + (directoryEntry)));\n' +
      '};',
      T.compile('-> { console.log("download #{code} into #{directoryEntry}") }'));
};

exports["test more string after interpolation"] = function () {
  assert.equal("replace((\"hello \" + (world) + \"!\")).slice(0);",
      T.compile("replace(\"hello #{world}!\").slice(0)\n"));
};

if (module === require.main) {
  require("../test").run(exports);
}

