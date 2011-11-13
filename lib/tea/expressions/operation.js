var TOperation = function (operator, left, right) {
  this.operator = operator;
  this.left = left;
  this.right = right;
}

TOperation.prototype.toJavaScript = function () {
  return this.left.toJavaScript() + " " + this.operator + " " + this.right.toJavaScript();
}

exports.Operation = TOperation;

