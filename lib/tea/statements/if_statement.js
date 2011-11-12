var IfStatement = function (test, body, alternatives) {
  this.test = test;
  this.body = body;
  this.alternatives = alternatives || [];
}

IfStatement.prototype.toJavaScript = function() {
  var rs = [];
  rs.push("if (" + this.test.toJavaScript() + ") {");
  rs.push(this.body.toJavaScript());
  
  if (this.alternatives.length > 0) {
    this.alternatives.forEach(function (alternative) {
      rs = rs.concat(alternative.toJavaScript());
    });
  }
  
  rs.push("}");
  return rs;
}

module.exports = IfStatement;

