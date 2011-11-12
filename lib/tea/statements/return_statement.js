var TReturn = function (expression) {
  this.expression = expression;
}

TReturn.prototype.toJavaScript = function() {
  if (typeof this.expression != "undefined") {
    return "return " + this.expression.toJavaScript() + ";";
  } else {
    return "return;";
  }
}

module.exports = TReturn;

