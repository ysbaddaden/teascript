var scopes      = require("../../scopes");
var TNumber     = require("../types/number");
var TIdentifier = require("../identifier");

var ForStatement = function (identifier, range, body) {
  this.identifier = identifier;
  this.range = range;
  this.body = body;
}

ForStatement.prototype.toJavaScript = function() {
  var rs = []
  var i = this.identifier.toJavaScript();
  var init, cond, update
  var left, right, rl, rr;
  
  if (this.range.numbers()) {
    init = [ i + " = " + this.range.left.toJavaScript() ];
    
    if (this.range.up()) {
      cond   = i + (this.range.exclusive ? " < " : " <= ") + this.range.right.toJavaScript();
      update = i + "++";
    } else {
      cond   = i + (this.range.exclusive ? " > " : " >= ") + this.range.right.toJavaScript();
      update = i + "--";
    }
  } else {
    init = [];
    
    if (this.range.left.constructor === TNumber) {
      l = this.range.left.value;
      init.push(i + " = " + l);
    } else if (this.range.left.constructor === TIdentifier) {
      l = this.range.left.value;
      init.push(i + " = " + l);
    } else {
      l = scopes.reference();
      init.push(i + " = " + l + " = " + this.range.left.toJavaScript());
    }
    
    if (this.range.right.constructor === TNumber) {
      r = this.range.right.value;
    } else if (this.range.right.constructor === TIdentifier) {
      r = this.range.right.value;
    } else {
      r = scopes.reference();
      init.push(r + " = " + this.range.right.toJavaScript());
    }
    
    if (this.range.exclusive) {
      cond = l + " > " + r + " ? " + i + " > "  + r + " : " + i + " < "  + r;
    } else {
      cond = l + " > " + r + " ? " + i + " >= " + r + " : " + i + " <= " + r;
    }
    update = l + " > " + r + " ? " + i + "-- : " + i + "++";
  }
  rs.push("for (" + [ init.join(", "), cond, update ].join("; ") + ") {");
  rs.push(this.body.toJavaScript());
  rs.push("}");
  return rs;
}

module.exports = ForStatement;

