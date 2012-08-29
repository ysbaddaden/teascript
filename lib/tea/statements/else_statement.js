var ElseStatement = function (body) {
  this.body = body;
};

ElseStatement.prototype.toJavaScript = function(options) {
  var rs = [];
  
  if (options && options['case']) {
    rs.push("default:");
  } else {
    rs.push("} else {");
  }
  rs.push(this.body.toJavaScript());
  return rs;
};

exports.ElseStatement = ElseStatement;

