function Unary() {}
Unary.prototype.init = function (operator, right) {
    var self = this;
    self.operator = operator;
    self.right = right;
    return self;
};
Unary.prototype.compile = function () {
    var self = this;
    var rs;
    rs = [self.operator, self.right.compile()];
    return self.operator === 'typeof' ? rs.join(' ') : rs.join('');
};
module.exports = Unary;