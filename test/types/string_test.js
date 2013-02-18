var assert = require("assert");
var T = require("../../build/tea");

exports.testSingleQuotedString = function () {
  assert.equal("'this is a string';", T.compile("'this is a string'"));
  
  assert.equal("'\\n this is a string\\n  with linebreaks and leading spaces\\n  ';",
    T.compile("'\n this is a string\n  with linebreaks and leading spaces\n  '"));
};

exports.testDoubleQuotedString = function () {
  assert.equal('"this is a string";', T.compile('"this is a string"'));
  
  assert.equal('"\\n this is a string\\n  with linebreaks and leading spaces\\n  ";',
    T.compile('"\n this is a string\n  with linebreaks and leading spaces\n  "'));
};

exports.testAddingStrings = function () {
  assert.equal('var space;\nspace = " ";\n"hello" + space + "world";',
    T.compile('space = " "; "hello" + space + "world"'));
  
  assert.equal('var space;\nspace = " ";\n"hello" + space + "world";',
    T.compile('space = " "\n"hello" +\nspace +\n"world"'));
};

if (module === require.main) {
  require("../test").run(exports);
}

