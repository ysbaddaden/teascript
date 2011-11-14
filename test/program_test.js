var assert = require("assert");
var T = require("../lib/tea");

exports.testProgram = function () {
  assert.equal("var T;\nT = require('./tea');",
    T.toJavaScript("T = require('./tea')"));
  
  assert.equal("(function () {\n" +
    "    var T;\n" +
    "    T = require('./tea');\n" +
    "}());",
    T.toJavaScript("T = require('./tea')", { scoped: true }));
}

if (module === require.main) {
  require("./test").run(exports);
}

