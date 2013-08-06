var Identifier, scopes;
scopes = require('../scopes');
Identifier = require('../identifier');

function ForOfStatement(identifier, index, expression, body) {
    var self = this;
    self.identifier = identifier;
    self.index = index;
    self.expression = expression;
    self.body = body;
}
ForOfStatement.prototype.compile = function () {
    var self = this;
    var r1, r2, r3, rs;
    rs = [];
    r1 = self.reference(rs);
    r2 = self.index ? self.index.compile() : scopes.reference();
    r3 = scopes.reference();
    scopes.pushIdentifier(self.identifier.value);
    if (self.index) {
        scopes.pushIdentifier(self.index.value);
    }
    rs.push('for (' + r2 + ' = 0, ' + r3 + ' = ' + r1 + '.length; ' + r2 + ' < ' + r3 + '; ' + r2 + '++) {');
    rs.push(self.identifier.compile() + ' = ' + r1 + '[' + r2 + '];');
    rs.push(self.body.compile());
    rs.push('}');
    return rs.join('');
};
ForOfStatement.prototype.reference = function (rs) {
    var self = this;
    var r1;
    if (self.expression instanceof Identifier) {
        r1 = self.expression.compile();
    } else {
        r1 = scopes.reference();
        rs.push(r1 + '=' + self.expression.compile() + ';');
    }
    return r1;
};
module.exports = ForOfStatement;