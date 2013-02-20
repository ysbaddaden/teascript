var assert = require("assert");
var T = require("../../lib/tea");

exports.testEmptyArrayDeclaration = function () {
  assert.equal("[];", T.compile("[]"));
  assert.equal("[];", T.compile(" [ \n ] "));
};

exports.testArrayDeclaration = function () {
  assert.equal("[1, 2, 3];", T.compile("[1,2,   3]"));
  
  assert.equal("[1 + 4.51, 2 - 45 / 2, 3];",
    T.compile("[1 + 4.51,2 - 45 / 2,   3]"));
  
  assert.equal("[coords.x(), coords.y()];",
    T.compile("[coords.x(), coords.y()]"));
  
  assert.equal("var matrix;\nmatrix = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n];",
    T.compile(
      "matrix = [" +
      "  [ 1, 2, 3 ]," +
      "  [ 4, 5, 6 ]," +
      "  [ 7, 8, 9 ]" +
      "]"
    ));
};

exports.testOptionalLinefeedsAndLeadingComma = function () {
  assert.equal("[0, a, 2];",
    T.compile(" [ 0 \n, a\n,\n    2\n ] "));
  
  assert.equal("[a, b, azeazuey];",
    T.compile(" [ a, b, azeazuey, \n ] "));
};

if (module === require.main) {
  require("../test").run(exports);
}
