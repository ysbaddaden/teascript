var WhileStatement = function (test, body) {
  this.test = test;
  this.body = body;
}

WhileStatement.prototype.toJavaScript = function() {
  var rs = [];
  rs.push("while (" + this.test.toJavaScript() + ") {");
  rs.push(this.body.toJavaScript());
  rs.push("}");
  return rs;
}

module.exports = WhileStatement;

