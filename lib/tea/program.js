var Beautify = require("js-beautify");
var scopes = require("../scopes");

var TProgram = function (body) {
  this.body = body;
};

TProgram.prototype.toJavaScript = function (options) {
  var body, program;

//  scopes.push();
  body = this.body.toJavaScript({ scope: true });
//  scopes.clear();

  if (options && options.scoped) {
    program = "(function () {" + body + "}());";
  } else {
    program = body;
  }
  return Beautify.js_beautify(program, {
    jslint_happy: true
  });
};

exports.Program = TProgram;

