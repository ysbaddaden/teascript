var Unary = function () {};
Unary.prototype.init = function (operator, right) {
    var self = this;
    self.operator = operator;
    self.right = right;
    return self;
};
Unary.prototype.compile = function () {
    var self = this;
    if (self.operator !== 'typeof') {
        return self.operator + self.right.compile();
    } else {
        return self.operator + ' ' + self.right.compile();
    }
};
module.exports = Unary;