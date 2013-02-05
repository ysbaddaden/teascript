var scopes = require('../../scopes');

var BeginStatement = function (body, rescues, ensure) {
  this.body    = body;
  this.rescues = rescues || [];
  this.ensure  = ensure;
};

BeginStatement.prototype.toJavaScript = function () {
  var rs = [];
  rs.push('try {');
  rs.push(this.body.toJavaScript());

  if (this.rescues.length > 0) {
    var ref = this.findReference() || scopes.reference({ push: false });
    rs.push('} catch (' + ref + ') {');
    for (i = 0, l = this.rescues.length; i < l; i++) {
      if (i !== 0) {
        rs.push("else " + this.rescues[i].toJavaScript(ref));
      } else {
        rs.push(this.rescues[i].toJavaScript(ref));
      }
    }
  }

  if (this.ensure) {
    rs.push('} finally {');
    rs.push(this.ensure.toJavaScript());
  }

  rs.push('}');
  return rs.join('\n');
};

BeginStatement.prototype.findReference = function () {
  var ref;
  for (var i = 0, l = this.rescues.length; i < l; i++) {
    var rescue = this.rescues[i];
    if (!rescue.identifier) {
      return;
    } else if (!ref) {
      ref = rescue.identifier.value;
    } else if (ref !== rescue.identifier.value) {
      return;
    }
  }
  return ref;
};

exports.BeginStatement = BeginStatement;
