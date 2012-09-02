var RequireStatement = function (expression) {
  this.expression = expression;
};

RequireStatement.prototype.toJavaScript = function () {
  return "require(" + this.expression.toJavaScript() + ")";
};

exports.RequireStatement = RequireStatement;

