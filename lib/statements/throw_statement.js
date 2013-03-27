function ThrowStatement() {}
ThrowStatement.prototype.init = function (expression) {
    var self = this;
    self.expression = expression;
    return self;
};
ThrowStatement.prototype.compile = function () {
    var self = this;
    return 'throw ' + self.expression.compile() + ';';
};
module.exports = ThrowStatement;