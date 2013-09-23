var Condition, Identifier, Keyword, isNil, scopes;
scopes = require('../scopes');
Identifier = require('../identifier');
Keyword = require('../keyword');
Condition = require('./condition');
isNil = function (arg) {
    return arg instanceof Keyword && arg.value === 'nil';
};

function Operation(operator, left, right) {
    var self = this;
    self.operator = operator;
    self.left = left;
    self.right = right;
}
Operation.prototype.constructor = Operation;
Operation.prototype.compile = function () {
    var self = this;
    var left, va;
    switch (self.operator.trim()) {
    case '===':
    case '!==':
        if (isNil(self.left) && self.right instanceof Identifier && !scopes.isDefined(self.right.value)) {
            va = self.right.compile();
            return 'typeof ' + va + ' ' + self.operator + " 'undefined' || " + va + ' ' + self.operator + ' null';
        }
        if (isNil(self.right) && self.left instanceof Identifier && !scopes.isDefined(self.left.value)) {
            va = self.left.compile();
            return 'typeof ' + va + ' ' + self.operator + " 'undefined' || " + va + ' ' + self.operator + ' null';
        }
        if (isNil(self.left) || isNil(self.right) || (self.left instanceof Condition && isNil(self.left.condition)) || (self.right instanceof Condition && isNil(self.right.condition))) {
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
module.exports = Operation;