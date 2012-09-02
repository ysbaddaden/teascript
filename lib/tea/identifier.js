//var scopes = require("../scopes");

TIdentifier = function (value) {
  if (value.match(/^__/)) {
    throw new Error("ERROR: invalid identifier '" + value + "'; identifiers starting with '__' are reserved.");
  }
  this.value = value;
};

TIdentifier.prototype.toJavaScript = function () {
  //scopes.pushIdentifier(this.value);
  return this.value;
};

exports.Identifier = TIdentifier;

