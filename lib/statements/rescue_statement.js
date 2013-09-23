var scopes;
scopes = require('../scopes');

function RescueStatement(names, identifier, body) {
    var self = this;
    self.names = names || [];
    self.identifier = identifier;
    self.body = body;
}
RescueStatement.prototype.constructor = RescueStatement;
RescueStatement.prototype.compile = function (ref) {
    var self = this;
    var names, rs;
    rs = [];
    if (self.names.length > 0) {
        names = self.names.map(function (name) {
            return ref + ' instanceof ' + name.compile();
        });
        rs.push('if (' + names.join(' || ') + ') {');
    }
    if (self.identifier && self.identifier.value !== ref) {
        scopes.pushIdentifier(ref);
        rs.push(self.identifier.compile() + ' = ' + ref + ';');
    }
    rs.push(self.body.compile());
    if (self.names.length > 0) {
        rs.push('}');
    }
    return rs.join('\n');
};
module.exports = RescueStatement;