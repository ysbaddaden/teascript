var assert = require("assert");
var T = require("../../lib/tea");

exports.testEmptyCaseStatement = function () {
  assert.equal("switch (true) {}", T.toJavaScript("case true\nend"));
  assert.equal("switch (true) {}", T.toJavaScript("case true;end"));
};

exports.testCaseStatement = function () {
  assert.equal("var x;\n" +
    "switch (true) {\n" +
    "case 1:\n" +
    "    x = false;\n" +
    "    break;\n" +
    "}",
    T.toJavaScript("case true\nwhen 1 then x = false\nend"));
  
  assert.equal("var x;\n" +
    "switch (true) {\n" +
    "case 1:\n" +
    "    x = false;\n" +
    "    break;\n" +
    "}",
    T.toJavaScript("case true\nwhen 1\nx = false\nend"));
  
  assert.equal("var x;\n" +
    "switch (true) {\n" +
    "    default: x = false;\n" +
    "}",
    T.toJavaScript("case true\nelse x = false\nend"));
  
  assert.equal("var x;\n" +
    "switch (true) {\n" +
    "case 1:\n" +
    "    x = true;\n" +
    "    break;\n" +
    "default:\n" +
    "    x = false;\n" +
    "}",
    T.toJavaScript("case true\nwhen 1 then x = true\nelse x = false\nend"));
  
  assert.equal("var x, y;\n" +
    "switch (true) {\n" +
    "case 1:\n" +
    "    x = true;\n" +
    "    break;\n" +
    "case 2:\n" +
    "case 3:\n" +
    "case 4 + y:\n" +
    "    x = null;\n"+
    "    break;\n" +
    "default:\n" +
    "    x = false;\n" +
    "}",
    T.toJavaScript("case true\nwhen 1 then x = true\nwhen 2, 3, 4 + y\nx = null\nelse x = false\nend"));
};

if (module === require.main) {
  require("../test").run(exports);
}
