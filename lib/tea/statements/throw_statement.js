var ThrowStatement = function (expression) {
  this.expression = expression;
};

ThrowStatement.prototype.toJavaScript = function () {
  return "throw " + this.expression.toJavaScript() + ";";
};

exports.ThrowStatement = ThrowStatement;
