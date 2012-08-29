var scopes = require("./../../scopes");

var TSplat = function (expression) {
  this.expression = expression;
};

TSplat.prototype.toJavaScript = function () {
  return this.expression.toJavaScript();
};

exports.Splat = TSplat;

