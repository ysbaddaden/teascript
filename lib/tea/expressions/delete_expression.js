var DeleteExpression = function (primary) {
  this.primary = primary;
};

DeleteExpression.prototype.toJavaScript = function () {
  return "delete " + this.primary.toJavaScript();
};

exports.DeleteExpression = DeleteExpression;
