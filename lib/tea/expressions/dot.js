var TDot = function (left, right) {
  this.left  = left;
  this.right = right;
};

TDot.prototype.toJavaScript = function () {
  return this.left.toJavaScript() + "." + this.right; //.toJavaScript();
};

exports.Dot = TDot;

