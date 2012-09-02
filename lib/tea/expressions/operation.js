var scopes = require("../../scopes");
var TIdentifier = require("../identifier").Identifier;

var TOperation = function (operator, left, right) {
  this.operator = operator;
  this.left = left;
  this.right = right;
};

TOperation.prototype.toJavaScript = function () {
  if (this.operator === "=" && this.left instanceof TIdentifier) {
    scopes.pushIdentifier(this.left.value);
  }
  return this.left.toJavaScript() + " " + this.operator + " " + this.right.toJavaScript();
};

exports.Operation = TOperation;

