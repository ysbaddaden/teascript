var ReturnStatement = function () {};
ReturnStatement.prototype.init = function (expression) {
    var self = this;
    self.expression = expression;
    return self;
};
ReturnStatement.prototype.compile = function () {
    var self = this;
    if (self.expression == null) {
        return 'return;';
    }
    return 'return ' + self.expression.compile() + ';';
};
module.exports = ReturnStatement;