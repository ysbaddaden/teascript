var ElsifStatement = function (test, body) {
  this.test = test;
  this.body = body;
};

ElsifStatement.prototype.toJavaScript = function() {
  var rs = [];
  rs.push("} else if (" + this.test.toJavaScript() + ") {");
  rs.push(this.body.toJavaScript());
  return rs.join("");
};

exports.ElsifStatement = ElsifStatement;

