var CaseStatement = function (test, whenStatements) {
  this.test = test;
  this.whenStatements = whenStatements || [];
}

CaseStatement.prototype.toJavaScript = function() {
  var rs = [];
  rs.push("switch (" + this.test.toJavaScript() + ") {");
  
  this.whenStatements.forEach(function (whenStatement) {
    rs = rs.concat(whenStatement.toJavaScript({ 'case': true }));
  });
  
  rs.push("}");
  return rs;
}

module.exports = CaseStatement;

