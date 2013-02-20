var Condition, Identifier, Keyword, scopes;
scopes = require('../scopes');
Identifier = require('../identifier');
Keyword = require('../keyword');
Condition = require('./condition');
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
    case '===':
    case '!==':
        if (self.isNil(self.left) || self.isNil(self.right) || (self.left instanceof Condition && self.isNil(self.left.condition)) || (self.right instanceof Condition && self.isNil(self.right.condition))) {
            self.operator = self.operator.substr(0, 2);
        }
        break;
    case '||=':
        left = self.left.compile();
        return 'if (!' + left + ') ' + left + ' = ' + self.right.compile();
    case '=':
        if (self.left instanceof Identifier) {
            scopes.pushIdentifier(self.left.value);
        }
        break;
    }
    return self.left.compile() + ' ' + self.operator + ' ' + self.right.compile();
};
Operation.prototype.isNil = function (arg) {
    var self = this;
    return arg instanceof Keyword && arg.value === 'nil';
};
module.exports = Operation;