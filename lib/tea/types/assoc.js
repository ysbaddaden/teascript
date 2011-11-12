var TAssoc = function (left, right) {
  this.left  = left;
  this.right = right;
}

TAssoc.prototype.toJavaScript = function () {
  return this.left.toJavaScript() + ": " + this.right.toJavaScript();
}

module.exports = TAssoc;

