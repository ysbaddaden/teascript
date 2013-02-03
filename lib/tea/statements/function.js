var scopes     = require("../../scopes");
var TOperation = require("../expressions/operation").Operation;
var TSplat     = require("../expressions/splat").Splat;

TFunction = function (name, args, body) {
  this.name = name;
  this.args = args;
  this.body = body;
};

TFunction.prototype.toJavaScript = function (options) {
  var rs = [], self = this;

  scopes.withScope(function () {
    var a = [];
    var b = [];
    var body = [];

    // arguments
    if (self.args) {
      self.args.forEach(function (arg) {
        var ident, v;

        switch (arg.constructor) {
        case TOperation: // default
          ident = arg.left.toJavaScript();
          a.push(ident);
          b.push("if (" + ident + " === undefined) " + arg.toJavaScript() + ";");
          break;

        case TSplat:     // splat
          scopes.pushIdentifier(ident = arg.toJavaScript());
          v = "Array.prototype.slice.call(arguments, " + a.length + ") || []";
          b.push("var " + ident + " = " + v + ";");
          break;

        default:         // regular arg
          a.push(arg.toJavaScript());
        }
      });
    }

    var name;
    options = options || {};

    if (options.objectName) {
      // prototype
      name = self.name.toJavaScript();
      rs.push(options.objectName + ".prototype." + name + " = function (" + a.join(", ") + ") {");
      rs.push('var self = this;');
    } else if (options.prefix) {
      // static
      name = self.name.toJavaScript();
      rs.push(options.prefix + "." + name + " = function (" + a.join(", ") + ") {");
    } else {
      // function
      name = self.name ? self.name.toJavaScript() : "";
      rs.push("function " + name + "(" + a.join(", ") + ") {");
    }

    if (typeof self.body !== "undefined") {
      body = self.body.toJavaScript({ scope: true });
    }
    if (body.length > 0 || b.length > 0) {
      rs.push(b.join(""));
      rs.push(body);
    }
    rs.push("}");
  });
  return rs.join("");
};

exports.Function = TFunction;

