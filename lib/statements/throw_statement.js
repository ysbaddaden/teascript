var ThrowStatement;
ThrowStatement = function (expression) {
    var self = this;
    self.expression = expression;
};
ThrowStatement.prototype.compile = function () {
    var self = this;
    return 'throw ' + self.expression.compile() + ';';
};
module.exports = ThrowStatement;