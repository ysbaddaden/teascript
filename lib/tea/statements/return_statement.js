var ReturnStatement = function (expression) {
  this.expression = expression;
}

ReturnStatement.prototype.toJavaScript = function() {
  if (typeof this.expression != "undefined") {
    return "return " + this.expression.toJavaScript() + ";";
  } else {
    return "return;";
  }
}

exports.ReturnStatement = ReturnStatement;

