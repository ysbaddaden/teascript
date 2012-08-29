var LoopStatement = function (body) {
  this.body = body;
};

LoopStatement.prototype.toJavaScript = function() {
  var rs = [];
  rs.push("while (true) {");
  rs.push(this.body.toJavaScript());
  rs.push("}");
  return rs;
};

exports.LoopStatement = LoopStatement;

