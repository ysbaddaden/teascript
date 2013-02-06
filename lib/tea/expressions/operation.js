var scopes = require("../../scopes");
var TIdentifier = require("../identifier").Identifier;

var TOperation = function (operator, left, right) {
  this.operator = operator;
  this.left = left;
  this.right = right;
};

TOperation.prototype.toJavaScript = function () {
  switch (this.operator.trim()) {
  case '||=':
    var left = this.left.toJavaScript();
    return 'if (!' + left + ') ' + left + ' = ' + this.right.toJavaScript();
  case '=':
    if (this.left instanceof TIdentifier) {
      scopes.pushIdentifier(this.left.value);
    }
    break;
  }
  return this.left.toJavaScript() + " " + this.operator + " " + this.right.toJavaScript();
};

exports.Operation = TOperation;

