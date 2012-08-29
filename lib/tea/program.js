var TProgram = function (body) {
  this.body = body;
};

TProgram.prototype.toJavaScript = function (options) {
  var body = this.body.toJavaScript({ scope: true });
  
  if (options && options.scoped) {
    return this.indent([ "(function () {", body, "}());" ], 0);
  } else {
    return this.indent(body, 0);
  }
};

TProgram.prototype.indent = function (ary, deep) {
  var _indent = "";
  var rs = [];
  
  for (var i = 0, l = deep * 4; i < l; i++) {
    _indent += " ";
  }
  
  ary.forEach(function (line) {
    if (typeof line.forEach === "function") {
      rs.push(this.indent(line, deep + 1));
    } else {
      rs.push(_indent + line);
    }
  }, this);
  return rs.join("\n");
};

exports.Program = TProgram;

