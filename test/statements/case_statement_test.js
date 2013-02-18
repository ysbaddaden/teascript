var assert = require("assert");
var T = require("../../build/tea");

exports.testEmptyCaseStatement = function () {
  assert.equal("switch (true) {\ncase 1:\n    break;\n}", T.compile("case true\nwhen 1\nend"));
  assert.equal("switch (true) {\ncase 1:\n    break;\n}", T.compile("case true;when 1;end"));
};

exports.testCaseStatement = function () {
  assert.equal("var x;\n" +
    "switch (true) {\n" +
    "case 1:\n" +
    "    x = false;\n" +
    "    break;\n" +
    "}",
    T.compile("case true\nwhen 1 then x = false\nend"));
  
  assert.equal("var x;\n" +
    "switch (true) {\n" +
    "case 1:\n" +
    "    x = false;\n" +
    "    break;\n" +
    "}",
    T.compile("case true\nwhen 1\nx = false\nend"));
  
  assert.equal("var x;\n" +
    "switch (true) {\n" +
    "case 1:\n" +
    "    break;\n" +
    "default:\n" +
    "    x = false;\n" +
    "}",
    T.compile("case true\nwhen 1\nelse x = false\nend"));
  
  assert.equal("var x;\n" +
    "switch (true) {\n" +
    "case 1:\n" +
    "    x = true;\n" +
    "    break;\n" +
    "default:\n" +
    "    x = false;\n" +
    "}",
    T.compile("case true\nwhen 1 then x = true\nelse x = false\nend"));
  
  assert.equal("var x;\n" +
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
    T.compile("case true\nwhen 1 then x = true\nwhen 2, 3, 4 + y\nx = null\nelse x = false\nend"));
};

if (module === require.main) {
  require("../test").run(exports);
}
