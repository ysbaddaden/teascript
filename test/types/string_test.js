var assert = require("assert");
var T = require("../../lib/tea");

exports.testSingleQuotedString = function () {
  assert.equal("'this is a string';", T.toJavaScript("'this is a string'"));
  
  assert.equal("'\\n this is a string\\n  with linebreaks and leading spaces\\n  ';",
    T.toJavaScript("'\n this is a string\n  with linebreaks and leading spaces\n  '"));
};

exports.testDoubleQuotedString = function () {
  assert.equal('"this is a string";', T.toJavaScript('"this is a string"'));
  
  assert.equal('"\\n this is a string\\n  with linebreaks and leading spaces\\n  ";',
    T.toJavaScript('"\n this is a string\n  with linebreaks and leading spaces\n  "'));
};

exports.testAddingStrings = function () {
  assert.equal('var space;\nspace = " ";\n"hello" + space + "world";',
    T.toJavaScript('space = " "; "hello" + space + "world"'));
  
  assert.equal('var space;\nspace = " ";\n"hello" + space + "world";',
    T.toJavaScript('space = " "\n"hello" +\nspace +\n"world"'));
};

if (module === require.main) {
  require("../test").run(exports);
}

