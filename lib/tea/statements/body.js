var scopes = require("../../scopes");

var TBody = function (statement) {
  this.statements = [];
  
  if (typeof statement !== "undefined") {
    this.push(statement);
  }
}

TBody.prototype.push = function (statement) {
  this.statements.push(statement);
}

TBody.prototype.parseStatements = function () {
  this.body = [];
  
  this.statements.forEach(function (statement) {
    this.body = this.body.concat(statement.toJavaScript());
  }, this);
}

TBody.prototype.toJavaScript = function (options) {
  if (options && options.scope) {
    var identifiers = scopes.withScope(this.parseStatements.bind(this));
    if (identifiers.length) {
      this.body.unshift("var " + identifiers.sort().join(", ") + ";");
    }
  } else {
    this.parseStatements();
  }
  return this.body;
}

module.exports = TBody;

