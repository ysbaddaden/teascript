var scopes = require('../../scopes');

var RescueStatement = function (names, identifier, body) {
    this.names = names || [];
    this.identifier = identifier;
    this.body = body;
};

RescueStatement.prototype.toJavaScript = function (ref) {
    var rs = [];

    if (this.names.length > 0) {
        var names = this.names.map(function (name) {
            return ref + ' instanceof ' + name.toJavaScript();
        });
        rs.push('if (' + names.join(' || ') + ') {');
    }

    if (this.identifier && this.identifier.value !== ref) {
        scopes.pushIdentifier(ref);
        rs.push(this.identifier.toJavaScript() + ' = ' + ref + ';');
    }
    rs.push(this.body.toJavaScript());

    if (this.names.length > 0) {
        rs.push('}');
    }
    return rs.join('\n');
};

exports.RescueStatement = RescueStatement;

