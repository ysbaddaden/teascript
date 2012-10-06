var DeleteStatement = function (primary) {
  this.primary = primary;
};

DeleteStatement.prototype.toJavaScript = function () {
  return "delete " + this.primary.toJavaScript() + ";";
};

exports.DeleteStatement = DeleteStatement;
