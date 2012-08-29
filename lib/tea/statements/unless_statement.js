var UnlessStatement = function (test, body, alternative) {
  this.test = test;
  this.body = body || new T.Body();
  this.alternative = alternative;
};

UnlessStatement.prototype.toJavaScript = function() {
  var rs = [];
  rs.push("if (!(" + this.test.toJavaScript() + ")) {");
  rs.push(this.body.toJavaScript());
  
  if (typeof this.alternative !== "undefined") {
    rs = rs.concat(this.alternative.toJavaScript());
  }
  
  rs.push("}");
  return rs;
};

exports.UnlessStatement = UnlessStatement;

