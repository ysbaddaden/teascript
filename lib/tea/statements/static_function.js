var TFunction = require("./function.js").Function;

var TStaticFunction = function (name, args, body) {
  this.fn = new TFunction(name, args, body);
};

TStaticFunction.prototype.toJavaScript = function (options) {
  return this.fn.toJavaScript({ prefix: options.objectName });
};

exports.StaticFunction = TStaticFunction;
