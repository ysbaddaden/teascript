var assert = require("assert");
var T = require("../../lib/tea");

exports.testEmptyWhileStatement = function () {
  assert.equal("while (x < 10) {}", T.toJavaScript("while x < 10\nend"));
  assert.equal("while (x > 10) {}", T.toJavaScript("while x > 10;end"));
};

exports.testEmptyUntilStatement = function () {
  assert.equal("while (!(x < 10)) {}", T.toJavaScript("until x < 10\nend"));
  assert.equal("while (!(x > 10)) {}", T.toJavaScript("until x > 10;end"));
};

exports.testWhileStatement = function () {
  assert.equal("while (x < 10) {\n" +
               "    x += 1;\n" +
               "}",
               T.toJavaScript("while x < 10\n  x += 1\nend")
  );
  assert.equal("var x;\nx = 0;\n" +
               "while (x < 10) {\n" +
               "    x += 1;\n" +
               "}",
               T.toJavaScript("x = 0\nwhile x < 10\n  x += 1\nend")
  );
};

exports.testUntilStatement = function () {
  assert.equal("while (!(x > 10)) {\n" +
               "    x += 1;\n" +
               "}",
               T.toJavaScript("until x > 10\n  x += 1\nend")
  );
  assert.equal("var x;\nx = 0;\n" +
               "while (!(x > 10)) {\n" +
               "    x += 1;\n" +
               "}",
               T.toJavaScript("x = 0\nuntil x > 10\n  x += 1\nend")
  );
};

if (module === require.main) {
  require("../test").run(exports);
}
