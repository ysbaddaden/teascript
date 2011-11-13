var WhenStatement = function (tests, body) {
  this.tests = tests;
  this.body = body;
}

WhenStatement.prototype.toJavaScript = function() {
  var body = this.body.toJavaScript();
  body.push("break;");
  
  var rs = [];
  this.tests.forEach(function (expression) {
    rs.push("case " + expression.toJavaScript() + ":");
  });
  rs.push(body);
  return rs;
}

exports.WhenStatement = WhenStatement;

