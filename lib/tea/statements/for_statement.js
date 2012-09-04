var scopes      = require("../../scopes");
var TIdentifier = require("../identifier").Identifier;
var TNumber     = require("../types/number").Number;
var TRange      = require("../types/range").Range;

var ForStatement = function (identifier, expression, body) {
  this.identifier = identifier;
  this.expression = expression;
  this.body = body;
};

ForStatement.prototype.compileExpression = function () {
  var r1 = scopes.reference();
  var r2 = scopes.reference();
  var rs = [], self = this;

  scopes.withScope(function () {
    scopes.pushIdentifier(self.identifier.value);
    rs.push("for (" + r1 + " = 0, " + r2 + " = " + self.expression.toJavaScript() + ".length; " + r1 + " < " + r2 + "; " + r1 + "++) {");
    rs.push("var " + self.identifier.toJavaScript() + " = " + r2 + "[" + r1 + "];");
    rs.push(self.body.toJavaScript());
    rs.push("}");
  });
  return rs.join("");
};

ForStatement.prototype.compileRange = function () {
  var rs = [];
  var i = this.identifier.toJavaScript();
  var init, cond, update;
  var left, right, rl, rr;
  var range = this.expression;

  scopes.pushIdentifier(this.identifier.value);

  if (range.numbers()) {
    init = [ i + " = " + range.left.toJavaScript() ];
    
    if (range.up()) {
      cond   = i + (range.exclusive ? " < " : " <= ") + range.right.toJavaScript();
      update = i + "++";
    } else {
      cond   = i + (range.exclusive ? " > " : " >= ") + range.right.toJavaScript();
      update = i + "--";
    }
  } else {
    init = [];
    
    if (range.left.constructor === TNumber) {
      l = range.left.value;
      init.push(i + " = " + l);
    } else if (range.left.constructor === TIdentifier) {
      l = range.left.value;
      init.push(i + " = " + l);
    } else {
      l = scopes.reference();
      init.push(i + " = " + l + " = " + range.left.toJavaScript());
    }
    
    if (range.right.constructor === TNumber) {
      r = range.right.value;
    } else if (range.right.constructor === TIdentifier) {
      r = range.right.value;
    } else {
      r = scopes.reference();
      init.push(r + " = " + range.right.toJavaScript());
    }
    
    if (range.exclusive) {
      cond = l + " > " + r + " ? " + i + " > "  + r + " : " + i + " < "  + r;
    } else {
      cond = l + " > " + r + " ? " + i + " >= " + r + " : " + i + " <= " + r;
    }
    update = l + " > " + r + " ? " + i + "-- : " + i + "++";
  }
  rs.push("for (" + [ init.join(", "), cond, update ].join("; ") + ") {");
  rs.push(this.body.toJavaScript());
  rs.push("}");
  return rs.join("");
};

ForStatement.prototype.toJavaScript = function() {
  if (this.expression instanceof TRange) {
    return this.compileRange();
  } else {
    return this.compileExpression();
  }
};

exports.ForStatement = ForStatement;

