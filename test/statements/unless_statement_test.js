var assert = require("assert");
var T = require("../../lib/tea");

exports.testEmptyUnlessStatement = function () {
  assert.equal("if (!(true)) {}", T.toJavaScript("unless true then end"));
  assert.equal("if (!(true)) {}", T.toJavaScript("unless true\nend"));
  assert.equal("if (!(x === y)) {}", T.toJavaScript("unless x == y then\nend"));
};

exports.testUnlessStatement = function () {
  assert.equal("var x;\nif (!(true)) {\n    x = !y;\n}",
    T.toJavaScript("unless true then x = !y end"));
  
  assert.equal("var x, y;\n" +
    "if (!(true)) {\n" +
    "    x = !y;\n" +
    "    y = x;\n" +
    "}",
    T.toJavaScript("unless true\nx = !y\ny = x\nend"));
};

exports.testUnlessModifier = function () {
  assert.equal("var x;\n" +
    "if (!(y === true)) {\n" +
    "    x = true;\n" +
    "}",
    T.toJavaScript("x = true unless y == true"));
  
  assert.equal("var x;\n" +
    "if (!(!z)) {\n" +
    "    if (!(y)) {\n" +
    "        x = true;\n" +
    "    }\n" +
    "}",
    T.toJavaScript("x = true unless y unless !z"));
};

exports.testElseStatement = function () {
  assert.equal("var x;\n" +
    "if (!(y === true)) {\n" +
    "    x = false;\n" +
    "} else {\n" +
    "    x = true;\n" +
    "}",
    T.toJavaScript("unless y == true then x = false else x = true end"));
  
  assert.equal("var x;\n" +
    "if (!(y === true)) {\n" +
    "    x = false;\n" +
    "} else {\n" +
    "    x = true;\n" +
    "}",
    T.toJavaScript("unless y == true\n  x = false\nelse\nx = true\nend"));
};

if (module === require.main) {
  require("../test").run(exports);
}
