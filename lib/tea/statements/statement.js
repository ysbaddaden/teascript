var TStatement = function (value) {
  this.value = value;
};

TStatement.prototype.toJavaScript = function () {
  return this.value.toJavaScript() + ";";
};

exports.Statement = TStatement;

