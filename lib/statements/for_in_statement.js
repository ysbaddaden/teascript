var scopes;
scopes = require('../scopes');

function ForInStatement(_own, key, value, expression, body) {
    var self = this;
    self._own = _own;
    self.key = key;
    self.value = value;
    self.expression = expression;
    self.body = body;
}
ForInStatement.prototype.compile = function () {
    var self = this;
    var expr, rs;
    rs = [];
    key = self.key.compile();
    expr = self.expression.compile();
    scopes.pushIdentifier(self.key.value);
    rs.push('for (' + key + ' in ' + expr + ') {');
    if (self._own) {
        rs.push('if (' + expr + '.hasOwnProperty(' + key + ')) {');
        self.compileBody(rs);
        rs.push('}');
    } else {
        self.compileBody(rs);
    }
    rs.push('}');
    return rs.join('');
};
ForInStatement.prototype.compileBody = function (rs) {
    var self = this;
    if (self.value) {
        scopes.pushIdentifier(self.value.value);
        rs.push(self.value.compile() + ' = ' + self.expression.compile() + '[' + self.key.compile() + '];');
        rs.push(self.body.compile());
    } else {
        rs.push(self.body.compile());
    }
};
module.exports = ForInStatement;