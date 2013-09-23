function Unary(operator, right) {
    var self = this;
    self.operator = operator;
    self.right = right;
}
Unary.prototype.constructor = Unary;
Unary.prototype.compile = function () {
    var self = this;
    var rs;
    rs = [self.operator, self.right.compile()];
    return self.operator === 'typeof' ? rs.join(' ') : rs.join('');
};
module.exports = Unary;