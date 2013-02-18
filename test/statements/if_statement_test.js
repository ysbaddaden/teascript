var assert = require("assert");
var T = require("../../build/tea");

exports.testEmptyIfStatement = function () {
  assert.equal("if (true) {}", T.compile("if true then end"));
  assert.equal("if (true) {}", T.compile("if true\nend"));
  assert.equal("if (x === y) {}", T.compile("if x == y then\nend"));
};

exports.testIfStatement = function () {
  assert.equal("var x;\nif (true) {\n    x = !y;\n}",
    T.compile("if true then x = !y end"));
  
  assert.equal("var x, y;\n" +
    "if (true) {\n" +
    "    x = !y;\n" +
    "    y = x;\n" +
    "}",
    T.compile("if true\nx = !y\ny = x\nend"));
};

exports.testIfModifier = function () {
  assert.equal("var x;\n" +
    "if (y === true) {\n" +
    "    x = true;\n" +
    "}",
    T.compile("x = true if y == true"));
  
  assert.equal("var x;\n" +
    "if (!z) {\n" +
    "    if (y) {\n" +
    "        x = true;\n" +
    "    }\n" +
    "}",
    T.compile("x = true if y if !z"));
};

exports.testElseStatement = function () {
  assert.equal("var x;\n" +
    "if (y === true) {\n" +
    "    x = false;\n" +
    "} else {\n" +
    "    x = true;\n" +
    "}",
    T.compile("if y == true then x = false else x = true end"));
  
  assert.equal("var x;\n" +
    "if (y === true) {\n" +
    "    x = false;\n" +
    "} else {\n" +
    "    x = true;\n" +
    "}",
    T.compile("if y == true\n  x = false\nelse\nx = true\nend"));
  
  assert.equal("var a, x;\n" +
    "if (y === true) {\n" +
    "    x = false;\n" +
    "} else if (!y) {\n" +
    "    a = b;\n" +
    "} else {\n" +
    "    x = true;\n" +
    "}",
    T.compile("if y == true\n  x = false\nelsif !y\na = b\nelse\nx = true\nend"));
};

exports.testElsifStatement = function () {
  assert.equal("var x;\n" +
    "if (y === true) {\n" +
    "    x = false;\n" +
    "} else if (!y) {\n" +
    "    x = true;\n" +
    "}",
    T.compile("if y == true then x = false elsif !y then x = true end"));
  
  assert.equal("var x;\n" +
    "if (y === true) {\n" +
    "    x = false;\n" +
    "} else if (!y) {\n" +
    "    x = true;\n" +
    "}",
    T.compile("if y == true\n  x = false\nelsif !y\nx = true\nend"));
};

if (module === require.main) {
  require("../test").run(exports);
}
