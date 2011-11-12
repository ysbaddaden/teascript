var TParen = function (expression) {
  this.expression = expression;
}

TParen.prototype.toJavaScript = function () {
  return '(' + this.expression.toJavaScript() + ')';
}

module.exports = TParen;

