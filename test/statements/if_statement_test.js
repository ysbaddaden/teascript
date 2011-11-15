var assert = require("assert");
var T = require("../../lib/tea");

exports.testEmptyIfStatement = function () {
  assert.equal("if (true) {\n\n}", T.toJavaScript("if true then end"));
  assert.equal("if (true) {\n\n}", T.toJavaScript("if true\nend"));
  assert.equal("var x, y;\nif (x === y) {\n\n}", T.toJavaScript("if x == y then\nend"));
}

exports.testIfStatement = function () {
  assert.equal("var x, y;\nif (true) {\n    x = !y;\n}",
    T.toJavaScript("if true then x = !y end"));
  
  assert.equal("var x, y;\n" +
    "if (true) {\n" +
    "    x = !y;\n" +
    "    y = x;\n" +
    "}",
    T.toJavaScript("if true\nx = !y\ny = x\nend"));
}

exports.testIfModifier = function () {
  assert.equal("var x, y;\n" +
    "if (y === true) {\n" +
    "    x = true;\n" +
    "}",
    T.toJavaScript("x = true if y == true"));
  
  assert.equal("var x, y, z;\n" +
    "if (!z) {\n" +
    "    if (y) {\n" +
    "        x = true;\n" +
    "    }\n" +
    "}",
    T.toJavaScript("x = true if y if !z"));
}

if (module === require.main) {
  require("../test").run(exports);
}
