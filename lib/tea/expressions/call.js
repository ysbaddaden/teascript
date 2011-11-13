var TSplat = require("./splat.js").Splat;

var TCall = function (expression, args) {
  this.expression = expression;
  this.args = args || [];
}

TCall.prototype.callerName = function () {
  if (this.expression.constructor == TIdentifier) {
    return this.expression.value;
  } else {
    return this.expression.toJavaScript();
  }
}

TCall.prototype.toJavaScript = function () {
  var args  = [];
  var splat = [];
  
  this.args.forEach(function (decl) {
    if (decl.constructor === TSplat) {
      if (args.length > 0) {
        splat.push("[" + args.join(", ") + "]");
      }
      splat.push(decl.toJavaScript());
      args = [];
    } else {
      args.push(decl.toJavaScript());
    }
  });
  
  if (splat.length === 1 && args.length === 0) {
    return this.callerName() + ".apply(null, " + splat[0] + ")";
  } else if (splat.length > 0) {
    if (args.length > 0) {
      splat.push("[" + args.join(", ") + "]");
    }
    splat = "Array.prototype.concat.call(" + splat.join(", ") + ")";
    return this.callerName() + ".apply(null, " + splat + ")";
  } else {
    return this.callerName() + "(" + args.join(", ") + ")";
  }
}

exports.Call = TCall;

