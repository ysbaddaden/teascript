var Identifier, scopes;
scopes = require('../scopes');
Identifier = require('../identifier');
var Operation = function () {};
Operation.prototype.init = function (operator, left, right) {
    var self = this;
    self.operator = operator;
    self.left = left;
    self.right = right;
    return self;
};
Operation.prototype.compile = function () {
    var self = this;
    var left;
    switch (self.operator.trim()) {
    case '||=':
        left = self.left.compile();
        return 'if (!' + left + ') ' + left + ' = ' + self.right.compile();
        break;
    case '=':
        if (self.left instanceof Identifier) {
            scopes.pushIdentifier(self.left.value);
        }
        break;
    }
    return self.left.compile() + ' ' + self.operator + ' ' + self.right.compile();
};
module.exports = Operation;