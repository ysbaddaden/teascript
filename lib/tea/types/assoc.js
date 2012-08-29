var TIdentifier = require("../identifier").Identifier;

var TAssoc = function (left, right) {
  this.left  = left;
  this.right = right;
};

TAssoc.prototype.toJavaScript = function () {
  if (this.left.constructor === TIdentifier) {
    return this.left.value + ": " + this.right.toJavaScript();
  } else {
    return this.left.toJavaScript() + ": " + this.right.toJavaScript();
  }
};

exports.Assoc = TAssoc;

