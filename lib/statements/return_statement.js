function ReturnStatement(expression) {
    var self = this;
    self.expression = expression;
}
ReturnStatement.prototype.constructor = ReturnStatement;
ReturnStatement.prototype.compile = function () {
    var self = this;
    if (self.expression == null) {
        return 'return;';
    }
    return 'return ' + self.expression.compile() + ';';
};
module.exports = ReturnStatement;