var TObject = function (declarations) {
  this.declarations = declarations;
}

TObject.prototype.toJavaScript = function () {
  if (typeof this.declarations !== "undefined") {
    var declarations = this.declarations.map(function (decl) {
      return decl.toJavaScript();
    });
    return "{ " + declarations.join(", ") + " }";
  } else {
    return "{}";
  }
}

module.exports = TObject;

