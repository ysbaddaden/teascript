var TExpression = function (value) {
  this.value = value;
}

TExpression.prototype.toJavaScript = function () {
  return this.value.toJavaScript() + ";";
}

module.exports = TExpression;
