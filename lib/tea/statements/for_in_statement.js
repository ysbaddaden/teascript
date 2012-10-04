var scopes = require("../../scopes");

var ForInStatement = function (own, key, value, expression, body) {
  this.own = own;
  this.key = key;
  this.value = value;
  this.expression = expression;
  this.body = body;
};

ForInStatement.prototype.toJavaScript = function () {
  var rs = [];
  var key  = this.key.toJavaScript();
  var expr = this.expression.toJavaScript();

  scopes.pushIdentifier(this.key.value);

  rs.push("for (" + key + " in " + expr + ") {");
  if (this.own) {
    rs.push("if (" + expr + ".hasOwnProperty(" + key + ")) {");
    this.compileBody(rs);
    rs.push("}");
  } else {
    this.compileBody(rs);
  }
  rs.push("}");
  return rs.join("");
};

ForInStatement.prototype.compileBody = function (rs) {
  if (this.value) {
    scopes.pushIdentifier(this.value.value);
    rs.push(this.value.toJavaScript() + " = " + this.expression.toJavaScript() + "[" + this.key.toJavaScript() + "];");
    rs.push(this.body.toJavaScript());
  } else {
    rs.push(this.body.toJavaScript());
  }
};

exports.ForInStatement = ForInStatement;
