var TCondition = function (condition, a, b) {
  this.condition = condition;
  this.a = a;
  this.b = b;
};

TCondition.prototype.toJavaScript = function () {
  return this.condition.toJavaScript() + " ? " +
    this.a.toJavaScript() + " : " +
    this.b.toJavaScript();
};

exports.Condition = TCondition;

