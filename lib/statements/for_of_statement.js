var Identifier, scopes;
scopes = require('../scopes');
Identifier = require('../identifier');

function ForOfStatement() {}
ForOfStatement.prototype.init = function (identifier, index, expression, body) {
    var self = this;
    self.identifier = identifier;
    self.index = index;
    self.expression = expression;
    self.body = body;
    return self;
};
ForOfStatement.prototype.compile = function () {
    var self = this;
    return self.compileExpression();
};
ForOfStatement.prototype.compileExpression = function () {
    var self = this;
    var r1, r2, r3, rs;
    rs = [];
    if (self.expression instanceof Identifier) {
        r1 = self.expression.compile();
    } else {
        r1 = scopes.reference();
        rs.push(r1 + '=' + self.expression.compile() + ';');
    }
    r2 = self.index ? self.index.compile() : scopes.reference();
    r3 = scopes.reference();
    scopes.pushIdentifier(self.identifier.value);
    rs.push('for (' + r2 + ' = 0, ' + r3 + ' = ' + r1 + '.length; ' + r2 + ' < ' + r3 + '; ' + r2 + '++) {');
    rs.push(self.identifier.compile() + ' = ' + r1 + '[' + r2 + '];');
    rs.push(self.body.compile());
    rs.push('}');
    return rs.join('');
};
module.exports = ForOfStatement;