var assert = require("assert");
var T = require("../../lib/tea");

exports.testEmptyForStatement = function () {
  assert.equal("var __ref1, __ref2, i;\nfor (__ref1 = 0, __ref2 = ary.length; __ref1 < __ref2; __ref1++) {\n    i = ary[__ref1];\n}", T.toJavaScript("for i of ary\nend"));
  assert.equal("var __ref1, __ref2, i;\nfor (__ref1 = 0, __ref2 = elements.length; __ref1 < __ref2; __ref1++) {\n    i = elements[__ref1];\n}", T.toJavaScript("for i of elements do end"));
//  assert.equal("var i;\nfor (i = 0; i < 10; i++) {}",  T.toJavaScript("for i of ary\nend"));
//  assert.equal("var i;\nfor (i = 0; i <= 10; i++) {}", T.toJavaScript("for i of elements\nend"));
//  assert.equal("var i;\nfor (i = 10; i >= 0; i--) {}", T.toJavaScript("for i of ary\nend"));
//  assert.equal("var i;\nfor (i = 10; i > 0; i--) {}",  T.toJavaScript("for i of ary\nend"));
};

exports.testForStatementWithArray = function () {
  assert.equal("var __ref1, __ref2, item;\n" +
               "for (__ref1 = 0, __ref2 = ary.length; __ref1 < __ref2; __ref1++) {\n" +
               "    item = ary[__ref1];\n" +
               "}",
               T.toJavaScript("for item of ary\nend"));

  assert.equal("var __ref1, __ref2, __ref3, item;\n" +
               "__ref1 = elm.getElementsByTagName('div');\n" +
               "for (__ref2 = 0, __ref3 = __ref1.length; __ref2 < __ref3; __ref2++) {\n" +
               "    item = __ref1[__ref2];\n" +
               "}",
               T.toJavaScript("for item of elm.getElementsByTagName('div')\nend"));
};

//exports.testForStatementWithRange = function () {
//  assert.equal("var i;\nfor (i = 0; i <= 10; i++) {}", T.toJavaScript("for i of [0..10]\nend"));
//  assert.equal("var i, j;\nfor (i = 0; i < 10; i++) {\n" +
//               "    j = Math.pow(i);\n" +
//               "}",
//              T.toJavaScript("for i of [0...10]\n  j = Math.pow(i)\nend")
//  );
//  assert.equal("var __ref1, __ref2, __ref3, a, ary, b, i;\n" +
//               "ary = [1, 2, 3, 4, 5];\n" +
//               "for (i = 0, __ref1 = ary.length; 0 > __ref1 ? i > __ref1 : i < __ref1; 0 > __ref1 ? i-- : i++) {\n" +
//               "    j -= i;\n" +
//               "    for (a = x; x > y ? a >= y : a <= y; x > y ? a-- : a++) {\n" +
//               "        for (b = __ref2 = c.x, __ref3 = c.y; __ref2 > __ref3 ? b >= __ref3 : b <= __ref3; __ref2 > __ref3 ? b-- : b++) {}\n" +
//               "    }\n" +
//               "}",
//               T.toJavaScript("ary = [ 1, 2, 3, 4, 5 ]\n" +
//                              "for i of [0...ary.length]\n" +
//                              "  j -= i\n" +
//                              "  for a of [x..y] do\n" +
//                              "    for b of [c.x..c.y] do\n" +
//                              "    end\n" +
//                              "  end\n" +
//                              "end\n")
//  );
//};

exports.testOneLineForStatement = function () {
  assert.equal("var __ref1, __ref2, n, sum;\n" +
               "sum = 0;\n" +
               "for (__ref1 = 0, __ref2 = ary.length; __ref1 < __ref2; __ref1++) {\n" +
               "    n = ary[__ref1];\n" +
               "    sum += n;\n" +
               "}",
               T.toJavaScript("sum = 0\nsum += n for n of ary"));
};

if (module === require.main) {
  require("../test").run(exports);
}
