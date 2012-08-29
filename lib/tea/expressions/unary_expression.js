var UnaryExpression = function (operator, right) {
  this.operator = operator;
  this.right = right;
};

UnaryExpression.prototype.toJavaScript = function () {
  if (this.operator == "typeof") {
    return this.operator + " " + this.right.toJavaScript();
  } else {
    return this.operator + this.right.toJavaScript();
  }
};

exports.UnaryExpression = UnaryExpression;

