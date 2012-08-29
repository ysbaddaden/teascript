var TArray = function (declaration) {
  this.declaration = declaration || [];
};

TArray.prototype.toJavaScript = function () {
  if (this.declaration.length > 0) {
    var declaration = this.declaration.map(function (decl) {
      return decl.toJavaScript();
    });
    return "[ " + declaration.join(", ") + " ]";
  } else {
    return "[]";
  }
};

exports.Array = TArray;

