var assert = require("assert");
var T = require("../../build/tea");

exports.testEmptyWhileStatement = function () {
  assert.equal("while (x < 10) {}", T.compile("while x < 10\nend"));
  assert.equal("while (x > 10) {}", T.compile("while x > 10;end"));
};

exports.testEmptyUntilStatement = function () {
  assert.equal("while (!(x < 10)) {}", T.compile("until x < 10\nend"));
  assert.equal("while (!(x > 10)) {}", T.compile("until x > 10;end"));
};

exports.testWhileStatement = function () {
  assert.equal("while (x < 10) {\n" +
               "    x += 1;\n" +
               "}",
               T.compile("while x < 10\n  x += 1\nend")
  );
  assert.equal("var x;\nx = 0;\n" +
               "while (x < 10) {\n" +
               "    x += 1;\n" +
               "}",
               T.compile("x = 0\nwhile x < 10\n  x += 1\nend")
  );
};

exports.testUntilStatement = function () {
  assert.equal("while (!(x > 10)) {\n" +
               "    x += 1;\n" +
               "}",
               T.compile("until x > 10\n  x += 1\nend")
  );
  assert.equal("var x;\nx = 0;\n" +
               "while (!(x > 10)) {\n" +
               "    x += 1;\n" +
               "}",
               T.compile("x = 0\nuntil x > 10\n  x += 1\nend")
  );
};

if (module === require.main) {
  require("../test").run(exports);
}
