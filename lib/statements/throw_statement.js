function ThrowStatement(expression) {
    var self = this;
    self.expression = expression;
}
ThrowStatement.prototype.constructor = ThrowStatement;
ThrowStatement.prototype.compile = function () {
    var self = this;
    return 'throw ' + self.expression.compile() + ';';
};
module.exports = ThrowStatement;