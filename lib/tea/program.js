var Beautify = require("js-beautify");

var TProgram = function (body) {
  this.body = body;
};

TProgram.prototype.toJavaScript = function (options) {
  var body = this.body.toJavaScript({ scope: true });
  var program;

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

