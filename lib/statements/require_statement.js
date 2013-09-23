function RequireStatement(expression) {
    var self = this;
    self.expression = expression;
}
RequireStatement.prototype.constructor = RequireStatement;
RequireStatement.prototype.compile = function () {
    var self = this;
    return 'require(' + self.expression.compile() + ')';
};
module.exports = RequireStatement;