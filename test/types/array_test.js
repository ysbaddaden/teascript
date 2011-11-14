var assert = require("assert");
var T = require("../../lib/tea");

exports.testEmptyArrayDeclaration = function () {
  assert.equal("[];", T.toJavaScript("[]"));
  assert.equal("[];", T.toJavaScript(" [ \n ] "));
}

exports.testArrayDeclaration = function () {
  assert.equal("[ 1, 2, 3 ];", T.toJavaScript("[1,2,   3]"));
  assert.equal("[ 1 + 4.51, 2 - 45 / 2, 3 ];", T.toJavaScript("[1 + 4.51,2 - 45 / 2,   3]"));
  assert.equal("var coords;\n[ coords.x(), coords.y() ];", T.toJavaScript("[coords.x(), coords.y()]"));
}

exports.testOptionalLinefeedsAndLeadingComma = function () {
  assert.equal("var a;\n[ 0, a, 2 ];", T.toJavaScript(" [ 0 \n, a\n,\n    2\n ] "));
  assert.equal("var a, azeazuey, b;\n[ a, b, azeazuey ];", T.toJavaScript(" [ a, b, azeazuey, \n ] "));
}

if (module === require.main) {
  require("../test").run(exports);
}

