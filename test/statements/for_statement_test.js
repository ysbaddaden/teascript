var assert = require("assert");
var T = require("../../lib/tea");

exports.testEmptyForStatement = function () {
  assert.equal("var i;\nfor (i = 0; i <= 10; i++) {}", T.toJavaScript("for i in [0..10]\nend"));
  assert.equal("var i;\nfor (i = 0; i < 10; i++) {}",  T.toJavaScript("for i in [0...10]\nend"));
  assert.equal("var i;\nfor (i = 10; i >= 0; i--) {}", T.toJavaScript("for i in [10..0]\nend"));
  assert.equal("var i;\nfor (i = 10; i > 0; i--) {}",  T.toJavaScript("for i in [10...0]\nend"));
};

exports.testForStatementWithRange = function () {
  assert.equal("var i;\nfor (i = 0; i <= 10; i++) {}", T.toJavaScript("for i in [0..10]\nend"));
  assert.equal("var i, j;\n" +
               "for (i = 0; i < 10; i++) {\n" +
               "    j = Math.pow(i);\n" +
               "}",
              T.toJavaScript("for i in [0...10]\n  j = Math.pow(i)\nend")
  );
  assert.equal("var __ref1, __ref2, __ref3, a, ary, b, c, i, j;\n" +
               "ary = [1, 2, 3, 4, 5];\n" +
               "for (i = 0, __ref1 = ary.length; 0 > __ref1 ? i > __ref1 : i < __ref1; 0 > __ref1 ? i-- : i++) {\n" +
               "    j -= i;\n" +
               "    for (a = x; x > y ? a >= y : a <= y; x > y ? a-- : a++) {\n" +
               "        for (b = __ref2 = c.x, __ref3 = c.y; __ref2 > __ref3 ? b >= __ref3 : b <= __ref3; __ref2 > __ref3 ? b-- : b++) {}\n" +
               "    }\n" +
               "}",
               T.toJavaScript("ary = [ 1, 2, 3, 4, 5 ]\n" +
                              "for i in [0...ary.length]\n" +
                              "  j -= i\n" +
                              "  for a in [x..y] do\n" +
                              "    for b in [c.x..c.y] do\n" +
                              "    end\n" +
                              "  end\n" +
                              "end\n")
  );
};

exports.testOneLineForStatement = function () {
  assert.equal("var i, j;\n" +
               "for (i = 0; i < 10; i++) {\n" +
               "    j = Math.pow(i);\n" +
               "}",
              T.toJavaScript("j = Math.pow(i) for i in [0...10]")
  );
};

if (module === require.main) {
  require("../test").run(exports);
}
