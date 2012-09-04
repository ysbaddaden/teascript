var Beautify = require("js-beautify");
var scopes = require("../scopes");

var TProgram = function (body) {
  this.body = body;
};

TProgram.prototype.toJavaScript = function (options) {
  var body, program, self = this;

  scopes.run(function () {
    body = self.body.toJavaScript({ scope: true });
  });
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

