var UnaryExpression = function (operator, right) {
  this.operator = operator;
  this.right = right;
}

UnaryExpression.prototype.toJavaScript = function () {
  return this.operator + this.right.toJavaScript();
}

exports.UnaryExpression = UnaryExpression;

