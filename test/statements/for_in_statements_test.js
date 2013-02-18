var assert = require("assert");
var T = require("../../build/tea");

exports.testEmptyForInStatement = function () {
  assert.equal("var key;\nfor (key in hash) {}", T.compile("for key in hash\nend"));
  assert.equal("var key;\nfor (key in {}) {}", T.compile("for key in {}\nend"));
  assert.equal("var key;\nfor (key in {\n    a: 1,\n    b: 2\n}) {}", T.compile("for key in { a: 1, b: 2 }\nend"));
};

exports.testForInStatement = function () {
  assert.equal("var name;\n" +
               "for (name in attributes) {\n" +
               "    copy[name] = attributes[name];\n" +
               "}",
               T.compile("for name in attributes\n" +
                              "  copy[name] = attributes[name]\n" +
                              "end"));

  assert.equal("var name, value;\n" +
               "for (name in attributes) {\n" +
               "    value = attributes[name];\n" +
               "    copy[name] = value;\n" +
               "}",
               T.compile("for name, value in attributes\n" +
                              "  copy[name] = value\n" +
                              "end"));
};

exports.testForInStatementWithOwn = function () {
  assert.equal("var name;\n" +
               "for (name in attributes) {\n" +
               "    if (attributes.hasOwnProperty(name)) {\n" +
               "        copy[name] = attributes[name];\n" +
               "    }\n" +
               "}",
               T.compile("for own name in attributes\n" +
                              "  copy[name] = attributes[name]\n" +
                              "end"));

  assert.equal("var name, value;\n" +
               "for (name in attributes) {\n" +
               "    if (attributes.hasOwnProperty(name)) {\n" +
               "        value = attributes[name];\n" +
               "        copy[name] = value;\n" +
               "    }\n" +
               "}",
               T.compile("for own name, value in attributes\n" +
                              "  copy[name] = value\n" +
                              "end"));
};

exports.testOneLineForInStatement = function () {
  assert.equal("var name;\n" +
               "for (name in obj) {\n" +
               "    copy[name] = obj[name];\n" +
               "}",
              T.compile("copy[name] = obj[name] for name in obj")
  );
};

if (module === require.main) {
  require("../test").run(exports);
}
