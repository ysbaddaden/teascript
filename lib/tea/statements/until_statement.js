var UntilStatement = function (test, body) {
  this.test = test;
  this.body = body;
}

UntilStatement.prototype.toJavaScript = function() {
  var rs = [];
  rs.push("while (!(" + this.test.toJavaScript() + ")) {");
  rs.push(this.body.toJavaScript());
  rs.push("}");
  return rs;
}

exports.UntilStatement = UntilStatement;

