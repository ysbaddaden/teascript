var TSplat = require("./splat.js").Splat;

var NewExpression = function (expression, args) {
  this.expression = expression;
  this.args = args || [];
};

// The solution for splat arguments when newing an object, comes
// from CoffeeScript:
NewExpression.prototype.splatConstructorTemplate =
  "(function (fn, args, ctor) {" +
  "    ctor.constructor = fn.constructor;" +
  "    var child = new ctor(), result = fn.apply(child, args), t = typeof result;" +
  "    return (t == 'object' || t == 'function') result || child : child;" +
  "}(%{FUNCTION}, %{ARGS}, function () {}))";

NewExpression.prototype.toJavaScript = function () {
  var args = [], splat = [];
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

  if (splat.length > 0) {
    if (args.length > 0) {
      splat.push("[" + args.join(", ") + "]");
    }
    var expr = this.expression;
    return this.splatConstructorTemplate.replace(/(%\{(.+?)\})/g, function (x) {
      switch (x) {
      case "%{FUNCTION}": return expr.toJavaScript();
      case "%{ARGS}":     return "[].concat(" + splat.join(",")  + ")";
      }
    });
  } else {
    return "new " + this.expression.toJavaScript() + "(" + args.join(", ") + ")";
  }
};

exports.NewExpression = NewExpression;
