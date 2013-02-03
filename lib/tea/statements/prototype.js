var scopes = require("../../scopes.js");
var TIdentifier = require("../identifier.js").Identifier;

var TPrototype = function (name, parent, methods) {
  this.objectName = name;
  this.parentName = parent;
  this.methods    = methods;
};

TPrototype.prototype.toJavaScript = function () {
  var rs = "", self = this;

  scopes.withScope(function () {
    var name = self.objectName.toJavaScript();

    if (self.objectName instanceof TIdentifier) {
      scopes.pushIdentifier(self.objectName.value);
      rs += "var " + name + " = function () {};";
    } else {
      rs += name + " = function () {};";
    }

    if (self.parentName) {
      rs += name + ".prototype = new " + self.parentName.toJavaScript() + "();";
    }
    if (self.methods) {
      self.methods.forEach(function (fn) {
        rs += fn.toJavaScript({ objectName: name }) + ";";
      });
    }
  });
  return rs;
};

exports.Prototype = TPrototype;
