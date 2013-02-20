var assert = require("assert");
var T = require("../../lib/tea");

exports.testEmptyLoopStatement = function () {
  assert.equal("while (true) {}", T.compile("loop do\nend"));
  assert.equal("while (true) {}", T.compile("loop do;end"));
};

exports.testLoopStatement = function () {
  assert.equal("while (true) {\n" +
    "    doSomething();\n" +
    "}", T.compile("loop\ndoSomething()\nend"));
  
  assert.equal(
    "while (true) {\n" +
    "    if (x > 1) {\n" +
    "        break;\n" +
    "    } else {\n" +
    "        x += 1;\n" +
    "    }\n" +
    "}", T.compile("loop do;if x > 1;break;else x+= 1;end;end"));
};

if (module === require.main) {
  require("../test").run(exports);
}
